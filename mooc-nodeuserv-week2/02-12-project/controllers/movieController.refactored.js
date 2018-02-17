/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
module.exports = function (data) {
    var controller = {};

    controller.getMovieSummary = function (request, response) {
        data.getSummaries()
            .then(createSendResponse(response))
            .catch(function (error) {
                sendError(response, error);
            });
    };

    controller.getMovie = function (request, response) {
        var movieId = parseInt(request.params.movieId);
        data.getMovie(movieId)
            .then(createSendResponse(response))
            .catch(function (error) {
                sendError(response, error);
            });
    };

    controller.postMovie = function (request, response) {
        var movie = parseMovieBody(request.body);
        data.addMovie(movie)
            .then(createSendResponse(response))
            .catch(function (error) {
                sendError(response, error);
            });
    };

    controller.getReview = function (request, response) {
        //TODO
    }

    controller.postReview = function (request, response) {
        //TODO
    };

    controller.putMovie = function (request, response) {
        //TODO
    };

    controller.putReview = function (request, response) {
        //TODO
    };

    controller.deleteMovie = function (request, response) {
        //TODO
    };

    controller.deleteReview = function (request, response) {
        //TODO
    };
    return controller;
}

function createSendResponse(response) {
    return function (result) {
        sendResponse(response, result);
    }
}


function parseMovieBody(body) {
    return {
        name: body.name,
        year: parseInt(body.year),
        studio: body.studio,
        genre: body.genre,
        rating: body.rating,
        runtime: parseInt(body.runtime),
        director: body.director,
        description: body.description
    };
}

function sendResponse(response, obj) {
    response.send(JSON.stringify(obj, null, 2));
}

function sendError(response, error) {
    if (error === "NOTFOUND") {
        response.status(404);
        response.send("not found");
    } else if (error === "DBFAIL") {
        response.status(500);
        response.send("Database Error");
    } else {
        response.status(500);
        response.send("Server Error");
    }
}
