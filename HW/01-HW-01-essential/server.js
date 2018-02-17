/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var express = require('express');
var bodyParser = require('body-parser');

var movies = require('./movies.json');

var port = process.env.PORT || 8888;

var app = express();

app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send(JSON.stringify(movies, null, 2));
});

app.get('/:movieIndex', function (request, response) {
    var index = parseInt(request.params.movieIndex);
    if (index === 0 || index && movies[index]) {
        response.send(JSON.stringify(movies[index], null, 2));
    } else {
        response.status(404);
        response.send("not found");
    }
});

app.post('/', function (request, response) {
    var movie = request.body;
    movies.push(movie);
    response.send(JSON.stringify(movie, null, 2));
});

// add the put and delete operations.
app.put('/:movieIndex', function (request, response) {
    var index = parseInt(request.params.movieIndex);
    if (index === 0 || index && movies[index]) {
        var movie = request.body;
        movies[index] = movie;
        response.send(JSON.stringify(movies[index], null, 2));
    } else {
        response.status(404);
        response.send("not found");
    }
});

app.delete('/:movieIndex', function (request, response) {
    var index = parseInt(request.params.movieIndex);
    if (index === 0 || index && movies[index]) {
        response.send(JSON.stringify(movies[index], null, 2));
        movies.splice(index,1);
    } else {
        response.status(404);
        response.send("not found");
    }
});

var server = app.listen(port);
