/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var rawmovies = require('./movies.json');
var commons = require('./commons.js');
// index by id, this uses a dual collection aproach, an array and an object by index.
var moviesById = {};

var currentId = 100;

rawmovies.forEach(function (obj) {
    var id = addMovie(obj);
    var movie = moviesById[id];
    obj.reviews.forEach(function (obj2) {
        addReview(movie, obj2);
    });
});

function addMovie(obj) {
    var movie = parseMovie(obj);
    movie.id = currentId++;
    moviesById[movie.id] = movie;
    return movie.id;
}

function addReview(movie, obj) {
    var review = parseReview(obj);
    review.id = currentId++;
    movie.reviews.push(review);
    return review.id;
}
function parseReview(obj) {
    return {
        name: obj.name,
        description: obj.description,
        date: obj.date,
        score: parseInt(obj.score)
    }
}

function parseMovie(obj) {
    return {
        name: obj.name,
        year: parseInt(obj.year),
        studio: obj.studio,
        genre: obj.genre,
        rating: obj.rating,
        runtime: parseInt(obj.runtime),
        director: obj.director,
        description: obj.description,
        reviews: []
    };
}

module.exports.open = function (config) {
    var datasource = {};

    datasource.getSummaries = function () {
        return new Promise(function (resolve, reject) {
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
            resolve(summary);
        });
    }

    datasource.getMovie = function (movieId) {
        return new Promise(function (resolve, reject) {
            var movie = moviesById[movieId];
            if (movie) {
                resolve(movie);
            } else {
                reject(commons.errors.NOT_FOUND);
            }
        });
    }

    datasource.getReview = function (movieId, reviewId) {
        return new Promise(function (resolve, reject) {
            var movie = moviesById[movieId];
            if (movie) {
                var review = movie.reviews.filter(function (rev) {
                    return rev.id == reviewId;
                })[0];
                if (review) {
                    resolve(review);
                } else {
                    reject(commons.errors.NOT_FOUND);
                }
            } else {
                reject(commons.errors.NOT_FOUND);
            }
        });
    }

    datasource.addMovie = function (movie) {
        return new Promise(function (resolve, reject) {
            resolve(addMovie(movie));
        });
    }

    datasource.addReview = function (movieId, review) {
        return new Promise(function (resolve, reject) {
            var movie = moviesById[movieId];
            if (movie) {
                resolve(addReview(movie, review));
            } else {
                reject(commons.errors.NOT_FOUND);
            }
        });
    }

    datasource.updateMovie = function (movieId, movie) {
        return new Promise(function (resolve, reject) {
            var currmovie = moviesById[movieId];
            if (currmovie) {
                moviesById[movieId] = parseMovie(movie);
                moviesById[movieId].id = movieId;
                moviesById[movieId].reviews = currmovie.reviews;
                resolve("OK");
            } else {
                reject(commons.errors.NOT_FOUND);
            }
        });
    }

    datasource.updateReview = function (movieId, reviewId, review) {
        return new Promise(function (resolve, reject) {
            var currmovie = moviesById[movieId];
            if (currmovie) {
                for (var index = 0; index < currmovie.reviews.length; index++) {
                    if (currmovie.reviews[index].id == reviewId) {
                        currmovie.reviews[index] = parseReview(review);
                        currmovie.reviews[index].id = reviewId;
                        resolve("OK");
                        return;
                    }
                }
                reject(commons.errors.NOT_FOUND);
            } else {
                reject(commons.errors.NOT_FOUND);
            }
        });
    }

    datasource.removeMovie = function (movieId) {
        return new Promise(function (resolve, reject) {
            var currmovie = moviesById[movieId];
            if (currmovie) {
                delete moviesById[movieId];
                resolve("OK");
            } else {
                reject(commons.errors.NOT_FOUND);
            }
        });
    }

    datasource.removeReview = function (movieId, reviewId) {
        return new Promise(function (resolve, reject) {
            var currmovie = moviesById[movieId];
            if (currmovie) {
                for (var index = 0; index < currmovie.reviews.length; index++) {
                    if (currmovie.reviews[index].id == reviewId) {
                        currmovie.reviews.splice(index, 1);
                        resolve("OK");
                        return;
                    }
                }
                reject(commons.errors.NOT_FOUND);
            } else {
                reject(commons.errors.NOT_FOUND);
            }
        });
    }

    return datasource;
}

