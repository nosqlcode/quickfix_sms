var app = require('express')();


var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/test');


app.use(require('cors')());


app.use(require('body-parser').urlencoded({extended: true}));


app.post('/sms', require('./sms-handler'));


var Correction = mongoose.model('Correction', {
    citationNumber: String,
    defendant: String,
    type: String,
    fee: Number,
    timeStamp: Date,
    insuranceProvider: String,
    file: String,
    message: String
});

app.get('/corrections', function(req, resp) {

    var page = req.query.page || 1;
    var perPage = req.query.perPage || 10;

    var skip = perPage * (page - 1);

    Correction.find({}, null,
        {skip: skip, limit: perPage, sort: {timeStamp: 1}},
        function(error, corrections) {

        resp.send(corrections);
    });
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('listening on: ' + port);
});