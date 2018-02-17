/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
// insert a movie then reviews, this only works on the vm!
var oracledb = require('oracledb');

oracledb.autoCommit = true;

const movieInsert = "INSERT INTO MOVIES(MOVIEID, MOVIENAME, YEAR, STUDIO, GENRE, RATING, RUNTIME, DIRECTOR, MOVIEDESCRIPTION) " +
    "VALUES (MOVIES_SEQ.NEXTVAL, :name, :year, :studio, :genre, :rating, :runtime, :director, :description) " +
    "RETURNING MOVIEID INTO :outId";

const reviewInsert = "INSERT INTO REVIEWS(REVIEWID, MOVIEID, REVIEWERNAME, SCORE,REVIEWDATE, REVIEWDESCRIPTION) " +
    "VALUES (REVIEWS_SEQ.NEXTVAL, :movId, :name, :score, :rdate, :description) " +
    "RETURNING REVIEWID INTO :outId";

const connProperties = {
    connectString: "localhost/orcl",
    user: "movies_usr",
    password: "oracle"
}

oracledb.getConnection(connProperties)
    .then(function (connection) {
        var movieId;
        var inserPromise = connection.execute(
            movieInsert,
            {
                name: "name1",
                year: 2006,
                studio: "studio1",
                genre: "genre1",
                rating: "rating1",
                runtime: 120,
                director: "director1",
                description: "description 1",
                outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { outFormat: oracledb.OBJECT });
        inserPromise = inserPromise.then(function (result) {
            movieId = result.outBinds.outId[0];
            console.log("CREATED MOVIE WITH ID: " + movieId);
        });
        for (var i = 0; i < 10; i++) {
            (function (i) {
                inserPromise = inserPromise.then(function (result) {
                    return connection.execute(
                        reviewInsert,
                        {
                            movId: movieId,
                            name: "name" + i,
                            score: 1 + i,
                            rdate: "abc" + i,
                            description: "def" + i,
                            outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
                        },
                        { outFormat: oracledb.OBJECT });
                });
                inserPromise = inserPromise.then(function (result) {
                    console.log("CREATED REVIEW WITH ID: " + result.outBinds.outId[0]);
                });
            })(i);
        }
        inserPromise = inserPromise.then(function (result) {
            doRelease(connection);
        }).catch(function (err) {
            console.error(err.message);
            doRelease(connection);
        });
    })
    .catch(function (err) {
        console.error(err.message);
    });

function doRelease(connection) {
    connection.release(function (err) {
        if (err) {
            console.error(err.message);
        }
    });
}