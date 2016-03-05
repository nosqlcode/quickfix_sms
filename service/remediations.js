
var mongoose = require('mongoose');

var uuid = require('node-uuid');

var Remediation = mongoose.model('Remediation', {
    referenceId: String,
    citationNumber: String,
    defendant: String,
    type: String,
    fee: Number,
    timeStamp: Date,
    insuranceProvider: String,
    status: String
});

module.exports.save = function(model, callback) {

    model.referenceId = uuid.v4();
    model.timeStamp = new Date();
    model.status = 'opened';

    new Remediation(model).save(function(error, remediation) {

        callback(remediation);
    });
};

module.exports.findActionedRemediations = function(page, perPage, callback) {

    var skip = perPage * (page - 1);

    Remediation.find({status: 'actioned'}, null,
        {skip: skip, limit: perPage, sort: {timeStamp: 1}},
        function(error, remediations) {

            callback(remediations)
        });
};

module.exports.findById = function(id, callback) {

    Remediation.findById(id, function(error, remediation) {

        callback(remediation);
    });
};

module.exports.findByReferenceId = function(referenceId, callback) {

    Remediation.findOne({referenceId: referenceId}, function(error, remediation) {

        callback(remediation);
    });
};

module.exports.updateById = function(id, update, callback) {

    Remediation.findByIdAndUpdate(id, {$set: update}, {},
        function(error, effected) {

            callback();
        });
};