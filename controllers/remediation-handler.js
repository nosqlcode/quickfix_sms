
var remediations = require('../service/remediations');

var conversations = require('../service/conversations');


module.exports.map = function(app) {

    app.get('/remediations', function(req, resp) {

        var page = req.query.page || 1;
        var perPage = req.query.perPage || 10;

        remediations.findActionedRemediations(page, perPage,
            function(results) {

            resp.send(results);
        });
    });

    app.patch('/remediations/:id', function(req, resp) {

        remediations.updateById(req.params.id, req.body, function() {

            resp.end();

            if (req.body.status && req.body.status == 'resolved') {

                conversations.findByCitationNumber(remediation.citationNumber,
                    function(conversation) {

                        sms.send(conversation.from, 'The courts have approved the ' +
                            'resolution for your citation: ' + remediation.citationNumber);
                    });
            }
        });
    });
};

