
var mongoose = require('mongoose');

var RemediationAction = mongoose.model('RemediationAction', {
    referenceId: String,
    message: String,
    files: Array
});

module.exports.map = function(app) {

    app.post('/remediation-actions/referenceId',
        function(req, resp) {

        new RemediationAction({
            referenceId: req.params.referenceId,
            message: req.body.message,
            files: req.body.files
        }).save(function(error, remediationsAction) {

            resp.end();
        });
    });
};