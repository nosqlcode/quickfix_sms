
var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME,
    process.env.SENDGRID_PASSWORD);

module.exports.send = function(subject, body) {

    sendgrid.send({
        to:       'thomas@nosqlcode.com',
        from:     'mtvanguard@gmail.com',
        subject:  subject,
        text:     body
    }, function(error, json) {
        if (error) { return console.error(error); }
        console.log(json);
    });
};