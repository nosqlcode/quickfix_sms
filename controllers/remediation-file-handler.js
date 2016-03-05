

var multer = require('multer');
var upload = multer({storage: multer.memoryStorage()});


var mongoose = require('mongoose');

var RemediationFile = mongoose.model('RemediationFile', {
    fileName: String,
    mimeType: String,
    file: Buffer
});


module.exports.map = function(app) {

    app.post('/remediation-files', upload.single('upload'), function(req, resp) {

        new RemediationFile({
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            file: req.file.buffer }).save(function(error, remediationFile) {

            resp.send({id: remediationFile._id});
        });
    });

    app.get('/remediation-files/:id', function(req, resp) {

        RemediationFile.findById(req.params.id,
            function(error, remediationFile) {

                resp.writeHead(200, {
                    'Content-Type': remediationFile.mimeType,
                    'Content-Disposition': 'attachment; filename=',
                    'Content-Length': remediationFile.file.length
                });

                resp.end(remediationFile.file);
            });
    });
};