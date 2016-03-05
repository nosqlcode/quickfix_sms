
var remediations = require('../service/remediations');


module.exports.map = function(app) {

    app.get('/remediations', function(req, resp) {

        var page = req.query.page || 1;
        var perPage = req.query.perPage || 10;

        remediations.findActionedRemediations(page, perPage,
            function(results) {

            resp.send(results);
        });
    });

    app.patch('/remediations/:id', function(req, resp) {

        remediations.updateById(req.params.id, req.body, function() {

            resp.end();
        });
    });
};

