var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var twilio = require('twilio');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI :
    'mongodb://localhost/test');


app.use(bodyParser.json());


app.post('/sms', require('./sms-handler'));


app.listen(3000);