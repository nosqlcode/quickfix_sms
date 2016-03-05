
var mongoose = require('mongoose');

var Conversation = mongoose.model('Conversation',
    {
        from: String,
        caseNumber: String,
        messages: Array,
        providerOptions: Array
    });

var citations = require('./citations');
var insuranceProviders = require('./insurance-providers');


module.exports = function(req, resp) {

    var twiml = new twilio.TwimlResponse();

    var messageReceived = req.body.Body;

    Conversation.find({from: req.body.From}, function(error, conversations) {

        if (conversations.length == 0) {

            citations.findCitation(messageReceived, function(citation) {

                if (citation) {

                    var response = 'your case number: ' +
                        req.body.Body + ' has "no proof of insurance, "' +
                        'do you have insurance? y/n';

                    var conversation = new Conversation({
                        from: req.body.From,
                        caseNumber: Number(messageReceived),
                        messages: [messageReceived, response]
                    });

                    conversation.save();

                    twiml.message(response);
                    resp.send(twiml.toString());
                } else {

                    twiml.message('The court has no record of this citation. ' +
                        'We will text you back when citation: "' + messageReceived +
                        '" has been received. {Legal Disclaimer}');
                    resp.send(twiml.toString());
                }

            });

        } else {

            var conversation = conversations[0];

            var lastMessage = conversation.messages
                [conversation.messages.length - 1];

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

        insuranceProviders.findProvider(messageReceived, function(providers) {

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

    } else if(contains(lastMessage, 'Please select from the following:')) {

        var selection = Number(messageReceived);
        var provider = conversation.providerOptions[selection - 1];

        callback('We have sent a request for your auto insurance ' +
            'coverage information to: ' + provider);
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