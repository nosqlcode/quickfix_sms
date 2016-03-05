
var mongoose = require('mongoose');

var InsuranceProvider = mongoose.model('InsuranceProvider', {
    name: String
});

module.exports.findProvider = function(query, callback) {

    InsuranceProvider.find({name: new RegExp(query + '.*', "i")},
        function(error, insuranceProviders) {

        callback(insuranceProviders);
    });
};