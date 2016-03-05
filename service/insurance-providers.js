
var mongoose = require('mongoose');

var InsuranceProvider = mongoose.model('InsuranceProvider', {
    name: String,
    email: String
});

module.exports.findProviders = function(query, callback) {

    InsuranceProvider.find({name: new RegExp(query + '.*', "i")},
        function(error, insuranceProviders) {

        callback(insuranceProviders);
    });
};

module.exports.findProviderByName = function(name, callback) {

    InsuranceProvider.findOne({name: name}, function(error, provider) {

        callback(provider);
    });
};