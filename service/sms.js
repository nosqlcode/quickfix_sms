
var client = require('twilio')(process.env.TWILIO_USER,
    process.env.TWILIO_SECRET);

module.exports.send = function(to, message) {

    client.messages.create({
        to: to,
        from: '2015618112',
        body: message
    }, function(error) {

        if (error) {
            console.log(error);
        }
    });
};