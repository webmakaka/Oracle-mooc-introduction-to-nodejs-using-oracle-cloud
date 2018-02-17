/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var oracledb = require('oracledb');

const sqlMovieInsert = "INSERT INTO MOVIES(MOVIEID, MOVIENAME, YEAR, STUDIO, GENRE, RATING, RUNTIME, DIRECTOR, MOVIEDESCRIPTION) " +
    "VALUES (MOVIES_SEQ.NEXTVAL, :name, :year, :studio, :genre, :rating, :runtime, :director, :description) " +
    "RETURNING MOVIEID INTO :outId";

module.exports.addMovie = function (resolve, reject, connProperties, movie) {
    oracledb.getConnection(connProperties)
        .then(function (connection) {
            connection.execute(
                sqlMovieInsert,
                {
                    name: movie.name,
                    year: movie.year,
                    studio: movie.studio,
                    genre: movie.genre,
                    rating: movie.rating,
                    runtime: movie.runtime,
                    director: movie.director,
                    description: movie.description,
                    outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
                },
                { outFormat: oracledb.OBJECT })
                .then(function (result) {
                    resolve(result.outBinds.outId[0]);
                }).then(function () {
                    return connection.commit();
                }).then(function () {
                    doRelease(connection);
                }).catch(function (err) {
                    console.error("INSERT:" + JSON.stringify(err));
                    connection.rollback(function () {
                        doRelease(connection);
                    });
                    reject("DBFAIL");
                });
        }).catch(function (err) {
            console.error("DB:" + JSON.stringify(err));
            reject("DBFAIL");
        });
}

function doRelease(connection) {
    connection.release(function (err) {
        if (err) {
            console.error(JSON.stringify(err));
        }
    });
}