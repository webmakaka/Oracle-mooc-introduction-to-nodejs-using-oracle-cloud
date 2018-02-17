/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
module.exports = function (data) {
    var controller = {};

    controller.getAll = function (request, response) {
        response.send(JSON.stringify(data.getAll(), null, 2));
    };

    controller.get = function (request, response) {
        var id = parseInt(request.params.movieId);
        var movie = data.get(id);
        if (movie) {
            response.send(JSON.stringify(movie, null, 2));
        } else {
            response.status(404);
            response.send("not found");
        }
    };

    controller.post = function (request, response) {
        var movie = data.add(request.body);
        response.send(JSON.stringify(movie, null, 2));
    };

    controller.put = function (request, response) {
        var id = parseInt(request.params.movieId);
        var movie = data.update(id, request.body);
        if (movie) {
            response.send(JSON.stringify(movie, null, 2));
        } else {
            response.status(404);
            response.send("not found");
        }
    };

    controller.delete = function (request, response) {
        var id = parseInt(request.params.movieId);
        var movie = data.remove(id);
        if (movie) {
            response.send(JSON.stringify(movie, null, 2));
        } else {
            response.status(404);
            response.send("not found");
        }
    };
    return controller;
}

