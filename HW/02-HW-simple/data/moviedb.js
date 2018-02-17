/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var oracledb = require('oracledb');
var commons = require('./commons.js');
var dbQueries = require('./dbQueries.js')

oracledb.autoCommit = true;

module.exports.open = function (config) {
    var datasource = {};

    datasource.getSummaries = function () {
        return doInDB(config.db, function (connection) {
            return dbQueries.getSummaries(connection);
        });
    }

    datasource.getMovie = function (movieId) {
        return doInDB(config.db, function (connection) {
            return dbQueries.getMovie(connection, movieId);
        });
    }
    datasource.getReview = function (movieId, reviewId) {
        return doInDB(config.db, function (connection) {
            return dbQueries.getReview(connection, movieId, reviewId);
        });
    }

    datasource.addMovie = function (movie) {
        return doInDB(config.db, function (connection) {
            return dbQueries.addMovie(connection, movie);
        });
    }

    datasource.addReview = function (movieId, review) {
        return doInDB(config.db, function (connection) {
            return dbQueries.addReview(connection, movieId, review);
        });
    }

    datasource.updateMovie = function (movieId, movie) {
        return doInDB(config.db, function (connection) {
            return dbQueries.updateMovie(connection, movieId, movie);
        });
    }

    datasource.updateReview = function (movieId, reviewId, review) {
        return doInDB(config.db, function (connection) {
            return dbQueries.updateReview(connection, movieId, reviewId, review);
        });
    }


    datasource.removeMovie = function (movieId) {
        return doInDB(config.db, function (connection) {
            return dbQueries.removeMovie(connection, movieId);
        });
    }

    datasource.removeReview = function (movieId, reviewId) {
        return doInDB(config.db, function (connection) {
            return dbQueries.removeReview(connection, movieId, reviewId);
        });
    }

    return datasource;
}

function doInDB(connProperties, invokeThis) {
    return new Promise(function (resolve, reject) {
        oracledb.getConnection(connProperties)
            .then(function (connection) {
                invokeThis(connection)
                    .then(function (result) {
                        resolve(result);
                    }).then(function () {
                        return connection.commit();
                    }).then(function () {
                        doRelease(connection);
                    }).catch(function (err) {
                        connection.rollback(function () {
                            doRelease(connection);
                        })
                        console.error(err);
                        if (err == commons.errors.NOT_FOUND) {
                            reject(commons.errors.NOT_FOUND)
                        } else {
                            reject(commons.errors.DB);
                        }
                    });
            })
            .catch(function (err) {
                console.error(err.message);
                reject(commons.errors.DB);
            })
    });
}

function doRelease(connection) {
    connection.release(function (err) {
        if (err) {
            console.error(err.message);
        }
    });
}