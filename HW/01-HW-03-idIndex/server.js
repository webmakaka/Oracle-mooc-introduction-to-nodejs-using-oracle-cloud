/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var express = require('express');
var bodyParser = require('body-parser');

var movies = require('./movies.json');
// index by id, this uses a dual collection aproach, an array and an object by index.
var moviesById = {};

var currentId = 100;

movies.forEach(function (movie) {
    var id = currentId++;
    movie.id = id;
    moviesById[id] = movie;
});


var port = process.env.PORT || 8888;

var app = express();

app.use(bodyParser.json());

app.get('/', function (request, response) {
    // Create a summary of each of the movies
    var summary = movies.map(function (movie) {
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
    if (id === 0 || id && moviesById[id]) {
        response.send(JSON.stringify(moviesById[id], null, 2));
    } else {
        response.status(404);
        response.send("not found");
    }
});

app.post('/', function (request, response) {
    var movie = request.body;
    var id = currentId++;
    movie.id = id;
    movies.push(movie);
    moviesById[id] = movie;
    response.send(JSON.stringify(movie, null, 2));
});

app.put('/:movieId', function (request, response) {
    var id = parseInt(request.params.movieId);
    if (id === 0 || id && moviesById[id]) {
        var index = movies.indexOf(moviesById[id]);
        var movie = request.body;
        movie.id = id;
        moviesById[id] = movie;
        movies[index] = movie;
        response.send(JSON.stringify(movies[index], null, 2));
    } else {
        response.status(404);
        response.send("not found");
    }
});

app.delete('/:movieId', function (request, response) {
    var id = parseInt(request.params.movieId);
    if (id === 0 || id && moviesById[id]) {
        var index = movies.indexOf(moviesById[id]);
        response.send(JSON.stringify(movies[index], null, 2));
        movies.splice(index, 1);
        delete moviesById[id];
    } else {
        response.status(404);
        response.send("not found");
    }
});

var server = app.listen(port);
