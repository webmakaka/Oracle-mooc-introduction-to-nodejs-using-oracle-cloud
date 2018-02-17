/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var express = require('express');
var bodyParser = require('body-parser');


function start(config, data) {
    var app = express();

    app.use(bodyParser.json());

    app.get('/', function (request, response) {
        response.send(JSON.stringify(data.getAll(), null, 2));
    });

    app.get('/:movieId', function (request, response) {
        var id = parseInt(request.params.movieId);
        var movie = data.get(id);
        if (movie) {
            response.send(JSON.stringify(movie, null, 2));
        } else {
            response.status(404);
            response.send("not found");
        }
    });

    app.post('/', function (request, response) {
        var movie = data.add(request.body);
        response.send(JSON.stringify(movie, null, 2));
    });

    app.put('/:movieId', function (request, response) {
        var id = parseInt(request.params.movieId);
        var movie = data.update(id, request.body);
        if (movie) {
            response.send(JSON.stringify(movie, null, 2));
        } else {
            response.status(404);
            response.send("not found");
        }
    });

    app.delete('/:movieId', function (request, response) {
        var id = parseInt(request.params.movieId);
        var movie = data.delete(id);
        if (movie) {
            response.send(JSON.stringify(movie, null, 2));
        } else {
            response.status(404);
            response.send("not found");
        }
    });

    var server = app.listen(config.server.port);
}

module.exports.start = start;
