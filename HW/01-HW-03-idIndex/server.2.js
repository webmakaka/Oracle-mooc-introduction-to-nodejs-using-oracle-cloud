/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var express = require('express');
var bodyParser = require('body-parser');

// index by id, this uses a single object and filters it by id
var currentId = 100;
var movies = {};
require('./movies.json').forEach(function (movie) {
    var id = currentId++;
    movie.id = id;
    movies[id] = movie;
});


var port = process.env.PORT || 8888;

var app = express();

app.use(bodyParser.json());

app.get('/', function (request, response) {
    var flatMovies = [];
    for (var x in movies) {
        flatMovies.push(movies[x]);
    }
    // Create a summary of each of the movies
    var summary = flatMovies.map(function (movie) {
        return {
            id: movie.id,
            name: movie.name,
            year: movie.year,
            studio: movie.studio,
            genre: movie.genre,
            rating: movie.rating,
            runtime: movie.runtime,
            director: movie.director,
            description: movie.description,
            score: movie.reviews ? (movie.reviews.map(function (r) { return r.score }).reduce(function (a, b) { return a + b }, 0) / movie.reviews.length).toPrecision(3) : 0,
            reviews: movie.reviews ? movie.reviews.length : 0
        };
    })
    response.send(JSON.stringify(summary, null, 2));
});

app.get('/:movieId', function (request, response) {
    var id = parseInt(request.params.movieId);
    if (id === 0 || id && movies[id]) {
        response.send(JSON.stringify(movies[id], null, 2));
    } else {
        response.status(404);
        response.send("not found");
    }
});

app.post('/', function (request, response) {
    var movie = request.body;
    var id = currentId++;
    movie.id = id;
    movies[id] = movie;
    response.send(JSON.stringify(movie, null, 2));
});

app.put('/:movieId', function (request, response) {
    var id = parseInt(request.params.movieId);
    if (id === 0 || id && movies[id]) {
        var movie = request.body;
        movie.id = id;
        movies[id] = movie;
        response.send(JSON.stringify(movies[id], null, 2));
    } else {
        response.status(404);
        response.send("not found");
    }
});

app.delete('/:movieId', function (request, response) {
    var id = parseInt(request.params.movieId);
    if (id === 0 || id && movies[id]) {
        response.send(JSON.stringify(movies[id], null, 2));
        delete movies[id];
    } else {
        response.status(404);
        response.send("not found");
    }
});

var server = app.listen(port);
