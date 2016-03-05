
var remediationService = require('../service/remediation-service');


module.exports.map = function(app) {

    app.get('/remediations', function(req, resp) {

        var page = req.query.page || 1;
        var perPage = req.query.perPage || 10;

        remediationService.findActionedRemediations(page, perPage,
            function(remediations) {

            resp.send(remediations);
        });
    });

    app.patch('/remediations/:id', function(req, resp) {

        Remediation.findByIdAndUpdate(req.params.id, {$set: req.body}, {},
            function(error, effected) {

                resp.end();
            });
    });
};

