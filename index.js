var app = require('express')();

var expressHandlebars = require('express-handlebars');
app.engine('.hbs', expressHandlebars({extname: '.hbs'}));
app.set('view engine', '.hbs');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/test');


app.use(require('cors')());


app.use(require('body-parser').urlencoded({extended: true}));


app.post('/sms', require('./controllers/sms-handler'));

require('./controllers/remediation-handler').map(app);
require('./controllers/remediation-action-handler').map(app);

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('listening on: ' + port);
});