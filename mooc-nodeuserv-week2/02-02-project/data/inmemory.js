/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var rawmovies = require('./movies.json');
// index by id, this uses a dual collection aproach, an array and an object by index.
var moviesById = {};

var currentId = 100;

rawmovies.forEach(function (movie) {
    var id = currentId++;
    movie.id = id;
    moviesById[id] = movie;
});

module.exports.getAll = function () {
    var summary = [];
    for (id in moviesById) {
        var movie = moviesById[id];
        summary.push({
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
        });
    }
    return summary;
}

module.exports.get = function (id) {
    return moviesById[id];
}

module.exports.add = function (movie) {
    var id = currentId++;
    movie.id = id;
    moviesById[id] = movie;
    return movie;
}

module.exports.update = function (id, movie) {
    if (!isNaN(id) && moviesById[id]) {
        movie.id = id;
        moviesById[id] = movie;
        return movie;
    }
}

module.exports.remove = function (id) {
    if (!isNaN(id) && moviesById[id]) {
        var movie = moviesById[id];
        delete moviesById[id];
        return movie;
    }
}