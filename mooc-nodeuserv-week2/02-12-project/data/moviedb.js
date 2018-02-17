/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var oracledb = require('oracledb');
var dbQueries = require('./dbQueries.js')

oracledb.autoCommit = true;

const sqlSelectSummary = "SELECT MOVIES.*, " +
    "(SELECT COUNT(*)FROM REVIEWS WHERE REVIEWS.MOVIEID = MOVIES.MOVIEID) AS REVIEWCOUNT," +
    "(SELECT AVG(SCORE)FROM REVIEWS WHERE REVIEWS.MOVIEID = MOVIES.MOVIEID) AS REVIEWAVG " +
    "FROM MOVIES";

const sqlSelectMovie = "SELECT * FROM MOVIES WHERE MOVIEID = :movieId";

const sqlSelectReviews = "SELECT * FROM REVIEWS WHERE MOVIEID = :movieId";


module.exports.open = function (config) {
    var datasource = {};

    datasource.getSummaries = function () {
        return new Promise(function (resolve, reject) {
            oracledb.getConnection(config.db)
                .then(function (connection) {
                    connection.execute(
                        sqlSelectSummary,
                        [],
                        { outFormat: oracledb.OBJECT }
                    ).then(function (result) {
                        var summary = [];
                        result.rows.forEach(function (row) {
                            summary.push({
                                id: row.MOVIEID,
                                name: row.MOVIENAME,
                                year: row.YEAR,
                                studio: row.STUDIO,
                                genre: row.GENRE,
                                rating: row.RATING,
                                runtime: row.RUNTIME,
                                director: row.DIRECTOR,
                                description: row.MOVIEDESCRIPTION,
                                reviews: row.REVIEWCOUNT,
                                score: row.REVIEWAVG
                            });
                        });
                        resolve(summary);
                        doRelease(connection);
                    }).catch(function (err) {
                        console.error("QUERY:" + JSON.stringify(err))
                        reject("DBFAIL");
                    });
                }).catch(function (err) {
                    console.error("DB:" + JSON.stringify(err))
                    reject("DBFAIL");
                });
        });
    }

    datasource.getMovie = function (movieId) {
        return new Promise(function (resolve, reject) {
            oracledb.getConnection(config.db)
                .then(function (connection) {
                    var movie;
                    connection.execute(
                        sqlSelectMovie,
                        { movieId: movieId },
                        { outFormat: oracledb.OBJECT })
                        .then(function (result) {
                            if (result.rows.length == 0) {
                                throw "NOTFOUND";
                            }
                            var row = result.rows[0];
                            movie = {
                                id: row.MOVIEID,
                                name: row.MOVIENAME,
                                year: row.YEAR,
                                studio: row.STUDIO,
                                genre: row.GENRE,
                                rating: row.RATING,
                                runtime: row.RUNTIME,
                                director: row.DIRECTOR,
                                description: row.MOVIEDESCRIPTION,
                            };
                            return connection.execute(
                                sqlSelectReviews,
                                { movieId: movieId },
                                { outFormat: oracledb.OBJECT });
                        }).then(function (result) {
                            movie.reviews = result.rows.map(toReview);
                            resolve(movie);
                            doRelease(connection);
                        }).catch(function (err) {
                            console.error("QUERY::" + JSON.stringify(err));
                            if (err === "NOTFOUND") {
                                reject("NOTFOUND")
                            } else {
                                reject("DBFAIL");
                            }
                        });
                }).catch(function (err) {
                    console.error("DB::" + JSON.stringify(err));
                    reject("DBFAIL");
                });
        });
    }

    datasource.addMovie = function (movie) {
        return new Promise(function (resolve, reject) {
            dbQueries.addMovie(resolve, reject, config.db, movie);
        });
    }

    return datasource;
}


function doRelease(connection) {
    connection.release(function (err) {
        if (err) {
            console.error(JSON.stringify(err));
        }
    });
}


// Helper functions

function toMovie(result) {
    if (result.rows.length == 0) {
        throw commons.errors.NOT_FOUND;
    }
    var row = result.rows[0];
    return {
        id: row.MOVIEID,
        name: row.MOVIENAME,
        year: row.YEAR,
        studio: row.STUDIO,
        genre: row.GENRE,
        rating: row.RATING,
        runtime: row.RUNTIME,
        director: row.DIRECTOR,
        description: row.MOVIEDESCRIPTION,
    };
}

function toReview(row) {
    return {
        movie: row.MOVIEID,
        id: row.REVIEWID,
        name: row.REVIEWERNAME,
        score: row.SCORE,
        description: row.REVIEWDESCRIPTION,
        date: row.REVIEWDATE
    };
}
