/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var oracledb = require('oracledb');

oracledb.autoCommit = true;

module.exports.open = function (config) {
    var datasource = {};

    datasource.getAll = function (callback) {
        var connProperties = {
            user: config.db.user,
            password: config.db.password,
            connectString: config.db.connectString
        }
        oracledb.getConnection(connProperties, function (err, connection) {
            if (err) {
                callback();
                console.error(err.message);
                return;
            }
            connection.execute(
                "SELECT MOVIES.*, " +
                "(SELECT COUNT(*)FROM REVIEWS WHERE REVIEWS.MOVIEID = MOVIES.MOVIEID) AS REVIEWCOUNT," +
                "(SELECT AVG(SCORE)FROM REVIEWS WHERE REVIEWS.MOVIEID = MOVIES.MOVIEID) AS REVIEWAVG " +
                "FROM MOVIES",
                [],
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        connection.release(function (err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });
                        callback();
                        return;
                    }
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
                            score: row.REVIEWAVG,
                            reviews: row.REVIEWCOUNT
                        });
                    });
                    connection.release(function (err) {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                    callback(summary);
                });
        });
    }

    datasource.get = function (id, callback) {
        oracledb.getConnection(config.db, function (err, connection) {
            if (err) { callback(); } else {
                connection.execute(
                    "SELECT * FROM MOVIES WHERE MOVIEID = " + id,
                    [],
                    { outFormat: oracledb.OBJECT },
                    function (err, result) {
                        if (err || result.rows.length != 1) {
                            doRelease(connection);
                            callback();
                            return;
                        }
                        var row = result.rows[0];
                        var movie = {
                            id: row.MOVIEID,
                            name: row.MOVIENAME,
                            year: row.YEAR,
                            studio: row.STUDIO,
                            genre: row.GENRE,
                            rating: row.RATING,
                            runtime: row.RUNTIME,
                            director: row.DIRECTOR,
                            description: row.MOVIEDESCRIPTION,
                            reviews: []
                        };
                        connection.execute(
                            "SELECT * FROM REVIEWS WHERE MOVIEID = " + id,
                            [],
                            { outFormat: oracledb.OBJECT },
                            function (err, result) {
                                if (err) {
                                    doRelease(connection);
                                    callback();
                                    return;
                                }
                                result.rows.forEach(function (row) {
                                    movie.reviews.push({
                                        id: row.REVIEWID,
                                        name: row.REVIEWERNAME,
                                        score: row.SCORE,
                                        date: row.REVIEWDATE,
                                        description: row.REVIEWDESCRIPTION
                                    })
                                });
                                doRelease(connection);
                                callback(movie);
                            });

                    });
            }
        });
    }

    datasource.add = function (movie, callback) {
        callback();
    }

    datasource.update = function (id, movie, callback) {
        callback();
    }

    datasource.remove = function (id, callback) {
        callback();
    }

    return datasource;
}

function doRelease(connection) {
    connection.release(function (err) {
        if (err) {
            console.error(err.message);
        }
    });
}
