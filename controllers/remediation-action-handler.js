
var multer = require('multer');
var upload = multer({storage: multer.memoryStorage()});

var remediations = require('../service/remediations');
var conversations = require('../service/conversations');

var sms = require('../service/sms');

var mongoose = require('mongoose');

var RemediationAction = mongoose.model('RemediationAction', {
    referenceId: String,
    message: String,
    fileName: String,
    mimeType: String,
    file: String
});

var RemediationFile = mongoose.model('RemediationFile', {
    contents: Buffer
});


module.exports.map = function(app) {

    app.get('/remediation-actions-form/:referenceId', function(req, resp) {

        resp.render('layouts/remediation-actions',  {
            referenceId: req.params.referenceId
        });
    });

    app.post('/remediation-actions/:referenceId', upload.single('upload'),
        function(req, resp) {

        new RemediationFile({contents: req.file.buffer})
            .save(function(error, remediationFile) {

                new RemediationAction({
                    referenceId: req.params.referenceId,
                    message: req.body.message,
                    fileName: req.file.originalname,
                    mimeType: req.file.mimetype,
                    file: remediationFile._id
                }).save();

                resp.render('layouts/thank-you');

                remediations.findByReferenceId(req.params.referenceId,
                    function(remediation) {

                        conversations.findByCitationNumber(remediation.citationNumber,
                            function(conversation) {

                                sms.send(conversation.from, remediation.insuranceProvider +
                                    ' has sent us information related to your citation. ' +
                                    'This information will be under review by the courts.')
                            });
                    });
            });
    });

    app.get('/remediation-actions/:referenceId', function(req, resp) {

        RemediationAction.findOne({referenceId: req.params.referenceId},
            function(error, remediatonAction) {

                resp.send(remediatonAction);
            });
    });

    app.get('/remediation-files/:id', function(req, resp) {

        RemediationFile.findById(req.params.id,
            function(error, remediationFile) {

                resp.writeHead(200, {
                    'Content-Length': remediationFile.contents.length
                });

                resp.end(remediationFile.contents);
            });
    });
};

