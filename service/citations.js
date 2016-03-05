
var mongoose = require('mongoose');

var Citation = mongoose.model('Citation', {
    citationNumber: Number,
    firstName: String,
    lastName: String,
    licensePlate: String,
    violations: Array
});

module.exports.findCitation = function(citationNumber, callback) {

    Citation.find({citationNumber: citationNumber}, function(error, citations) {

        if (citations.length == 1) {
            callback(citations[0]);
        } else {
            callback(null);
        }
    });
};