/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var express = require('express');
var bodyParser = require('body-parser');

var movies = require('./movies.json')

var port = process.env.PORT || 8888;

var app = express();

app.use(bodyParser.json());

var currId = Object.keys(movies).map(function (id) { return parseInt(id) }).reduce(function (curr, value) {
    return Math.max(curr, value);
}, 0);
currId++;

app.get('/', function (request, response) {
    var filteredMov = [];
    for (var index in movies) {
        if (movies.hasOwnProperty(index)) {
            var movie = movies[index];
            filteredMov.push(
                {
                    id: movie.id,
                    name: movie.name,
                    year: movie.year,
                    studio: movie.studio,
                    genre: movie.genre,
                    rating: movie.rating,
                    runtime: movie.runtime,
                    director: movie.director,
                    description: movie.description,
                    score: (movie.reviews.map(function (r) { return r.score }).reduce(function (a, b) { return a + b }, 0) / movie.reviews.length).toPrecision(3),
                    reviews: movie.reviews.length
                });
        }
    }
    response.send(JSON.stringify(filteredMov, null, 2));
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
    var id = currId++;
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
