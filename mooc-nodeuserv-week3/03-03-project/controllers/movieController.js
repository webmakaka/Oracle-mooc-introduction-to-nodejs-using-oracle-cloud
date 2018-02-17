/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var commons = require('../data/commons.js');

module.exports = function (data) {
    var controller = {};

    controller.getMovieSummary = function (request, response) {
        data.getSummaries()
            .then(sendResponse.bind(this, response))
            .catch(sendError.bind(this, response));
    };

    controller.getMovie = function (request, response) {
        var movieId = parseInt(request.params.movieId);
        data.getMovie(movieId)
            .then(sendResponse.bind(this, response))
            .catch(sendError.bind(this, response));
    };

    controller.getReview = function (request, response) {
        var movieId = parseInt(request.params.movieId);
        var reviewId = parseInt(request.params.reviewId);
        data.getReview(movieId, reviewId)
            .then(sendResponse.bind(this, response))
            .catch(sendError.bind(this, response))
    }

    controller.postMovie = function (request, response) {
        var movie = parseMovieBody(request.body);
        data.addMovie(movie)
            .then(sendResponse.bind(this, response))
            .catch(sendError.bind(this, response));
    };

    controller.postReview = function (request, response) {
        var movieId = parseInt(request.params.movieId);
        var review = parseReviewBody(request.body);
        data.addReview(movieId, review)
            .then(sendResponse.bind(this, response))
            .catch(sendError.bind(this, response));
    };

    controller.putMovie = function (request, response) {
        var movieId = parseInt(request.params.movieId);
        var movie = parseMovieBody(request.body);
        data.updateMovie(movieId, movie)
            .then(sendResponse.bind(this, response))
            .catch(sendError.bind(this, response));
    };

    controller.putReview = function (request, response) {
        var movieId = parseInt(request.params.movieId);
        var reviewId = parseInt(request.params.reviewId);
        var review = parseReviewBody(request.body);
        data.updateReview(movieId, reviewId, review)
            .then(sendResponse.bind(this, response))
            .catch(sendError.bind(this, response));
    };

    controller.deleteMovie = function (request, response) {
        var movieId = parseInt(request.params.movieId);
        data.removeMovie(movieId)
            .then(sendResponse.bind(this, response))
            .catch(sendError.bind(this, response));
    };

    controller.deleteReview = function (request, response) {
        var movieId = parseInt(request.params.movieId);
        var reviewId = parseInt(request.params.reviewId);
        data.removeReview(movieId, reviewId)
            .then(sendResponse.bind(this, response))
            .catch(sendError.bind(this, response));
    };
    return controller;
}

function parseReviewBody(body) {
    return {
        name: body.name,
        date: body.date,
        score: parseInt(body.score),
        description: body.description
    };
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
    if (error === commons.errors.NOT_FOUND) {
        response.status(404);
        response.send("not found");
    } else if (error === commons.errors.DB) {
        response.status(500);
        response.send("Database Error");
    } else {
        response.status(500);
        response.send("Server Error");
    }
}
