
var twilio = require('twilio');

var conversations = require('../service/conversations');

var citations = require('./../service/citations');
var insuranceProviders = require('./../service/insurance-providers');


var remediationService = require('../service/remediations');


var emails = require('./../service/emails');


module.exports = function(req, resp) {

    var twiml = new twilio.TwimlResponse();

    var messageReceived = req.body.Body;

    conversations.findByFrom(req.body.From, function(conversation) {

        if (!conversation) {

            citations.findCitation(messageReceived, function(citation) {

                if (citation) {

                    var response = 'your case number: ' +
                        req.body.Body + ' has "no proof of insurance", ' +
                        'do you have insurance? y/n';

                    remediationService.save({
                        citationNumber: messageReceived,
                        type: 'insurance',
                        defendant: citation.lastName + ', ' + citation.firstName
                    }, function(remediation) {

                        conversations.save({
                            from: req.body.From,
                            citationNumber: messageReceived,
                            messages: [messageReceived, response],
                            remediation: remediation._id
                        });

                        twiml.message(response);
                        resp.send(twiml.toString());
                    });

                } else {

                    twiml.message('The court has no record of this citation. ' +
                        'We will text you back when citation: "' + messageReceived +
                        '" has been received. {Legal Disclaimer}');
                    resp.send(twiml.toString());
                }

            });

        } else {

            var lastMessage = conversation.messages[conversation.messages.length - 1];

            decideResponse(conversation, lastMessage, messageReceived,
                function(response) {

                    conversation.messages.push(messageReceived);
                    conversation.messages.push(response);
                    conversation.save();

                    twiml.message(response);
                    resp.send(twiml.toString());
                });
        }
    });
};


var decideResponse = function(conversation, lastMessage, messageReceived, callback) {

    if (contains(lastMessage, 'no proof of insurance')) {

        if (affirmative(messageReceived)) {

            callback('Respond with the first three letters' +
                ' of your insurance provider.');
        } else {

            callback('Please pay your fine provided by the court, ' +
                'and purchase auto insurance for future vehicular purposes...');
        }
    } else if(contains(lastMessage, 'first three letters')) {

        insuranceProviders.findProviders(messageReceived, function(providers) {

            if (providers.length > 0) {

                var options = providers.map(function(provider, index) {
                    return (index + 1) + '. ' + provider.name;
                }).join(', ');

                conversation.providerOptions = providers.map(function(provider) {
                    return provider.name;
                });

                callback('Please select from the following: ' + options);
            } else {

                callback('There are no Insurance Providers registered for ' +
                    'automated assistance that match: ' + messageReceived);
            }

        });

    } else if(contains(lastMessage, 'Please select from the following:') ||
        contains('was not a valid option')) {

        var selection = Number(messageReceived);

        // exit fast
        if (conversation.providerOptions.length < selection) {
            callback(selection + ' was not a valid option');
            return;
        }

        var providerName = conversation.providerOptions[selection - 1];

        insuranceProviders.findProviderByName(providerName, function(provider) {

            remediationService.findById(conversation.remediation,
                function(remediation) {

                    remediation.insuranceProvider = provider._id;
                    remediation.save();

                    emails.send(provider.email,
                        'Request for proof of insurance ' + remediation.citationNumber,

                        remediation.defendant + ' (DL: 85746303) received a citation and did ' +
                        'not have proof of Insurance while driving Plate Number ACD 123.  ' +
                        'Defendant is claiming coverage under ' + providerName + '.  ' +
                        'Please confirm whether ' + remediation.defendant + ' was covered on ' +
                        remediation.timeStamp + ' by providing us with the following information. ' +

                        'Please respond with this information here: http://' +
                        (process.env.APP_HOST || 'localhost:3000') + '/remediation-actions-form/' +
                            remediation.referenceId
                    );

                    callback('We have sent a request for your auto insurance ' +
                        'coverage information to: ' + providerName);
                });

        });

    } else {

        callback('not sure what to do....');
    }
};


var contains = function(target, value) {
    return target.indexOf(value) >= 0;
};

var affirmative = function(value) {
    value = value.toLowerCase();
    return value == 'y' || value == 'yes';
};