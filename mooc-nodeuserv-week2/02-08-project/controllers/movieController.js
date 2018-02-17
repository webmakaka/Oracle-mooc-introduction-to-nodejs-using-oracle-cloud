/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
module.exports = function (data) {
    var controller = {};

    controller.getAll = function (request, response) {
        data.getAll(createCallback(response));
    };

    controller.get = function (request, response) {
        var id = parseInt(request.params.movieId);
        data.get(id, createCallback(response));
    };

    controller.post = function (request, response) {
        data.add(request.body, createCallback(response));
    };

    controller.put = function (request, response) {
        var id = parseInt(request.params.movieId);
        data.update(id, request.body, createCallback(response));
    };

    controller.delete = function (request, response) {
        var id = parseInt(request.params.movieId);
        data.remove(id, createCallback(response));
    };
    return controller;
}

function createCallback(response) {
    return function (obj) {
        if (obj) {
            response.send(JSON.stringify(obj, null, 2));
        } else {
            response.status(404);
            response.send("not found");
        }
    }
}