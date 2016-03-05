
var mongoose = require('mongoose');

var Conversation = mongoose.model('Conversation',
    {
        from: String,
        citationNumber: String,
        messages: Array,
        providerOptions: Array,
        remediation: String
    });

module.exports.findByFrom = function(from, callback) {

    Conversation.findOne({from: from}, function(error, conversation) {

        callback(conversation);
    });
};

module.exports.save = function(model) {

    new Conversation(model).save();
};

module.exports.findByCitationNumber = function(citationNumber, callback) {

    Conversation.findOne({citationNumber: citationNumber},
        function(error, conversation) {

        callback(conversation);
    });
};