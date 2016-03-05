
var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME,
    process.env.SENDGRID_PASSWORD);

module.exports.send = function(to, subject, body) {

    sendgrid.send({
        to:       to,
        from:     'mtvanguard@gmail.com',
        subject:  subject,
        text:     body
    }, function(error, json) {
        if (error) { return console.error(error); }
        console.log(json);
    });
};