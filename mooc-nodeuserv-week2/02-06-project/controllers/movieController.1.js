/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
module.exports = function (data) {
    var controller = {};

    controller.getAll = function (request, response) {
        data.getAll(function (obj) {
            if (obj) {
                response.send(JSON.stringify(obj, null, 2));
            } else {
                response.status(404);
                response.send("not found");
            }
        });
    };

    controller.get = function (request, response) {
        var id = parseInt(request.params.movieId);
        data.get(id, function (obj) {
            if (obj) {
                response.send(JSON.stringify(obj, null, 2));
            } else {
                response.status(404);
                response.send("not found");
            }
        });
    };

    controller.post = function (request, response) {
        data.add(request.body, function (obj) {
            if (obj) {
                response.send(JSON.stringify(obj, null, 2));
            } else {
                response.status(404);
                response.send("not found");
            }
        });
    };

    controller.put = function (request, response) {
        var id = parseInt(request.params.movieId);
        data.update(id, request.body, function (obj) {
            if (obj) {
                response.send(JSON.stringify(obj, null, 2));
            } else {
                response.status(404);
                response.send("not found");
            }
        });
    };

    controller.delete = function (request, response) {
        var id = parseInt(request.params.movieId);
        data.remove(id, function (obj) {
            if (obj) {
                response.send(JSON.stringify(obj, null, 2));
            } else {
                response.status(404);
                response.send("not found");
            }
        });
    };
    return controller;
}

