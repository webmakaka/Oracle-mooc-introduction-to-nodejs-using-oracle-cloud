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

oracledb.getConnection(connProperties, function (err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
    var mparams = {
        name: "name1",
        year: 2006,
        studio: "studio1",
        genre: "genre1",
        rating: "rating1",
        runtime: 120,
        director: "director1",
        description: "description 1",
        outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
    }
    connection.execute(
        movieInsert,
        mparams,
        { outFormat: oracledb.OBJECT },
        function (err, result) {
            if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
            }
            var movieId = result.outBinds.outId[0];
            console.log("CREATED MOVIE WITH ID: " + movieId);
            var r1params = {
                movId: movieId,
                name: "name1",
                score: 3,
                rdate: "abc",
                description: "def",
                outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            }
            connection.execute(
                reviewInsert,
                r1params,
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    console.log("CREATED REVIEW WITH ID: " + result.outBinds.outId[0]);
                    var r2params = {
                        movId: movieId,
                        name: "name2",
                        score: 4,
                        rdate: "abc2",
                        description: "def2",
                        outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
                    }
                    connection.execute(
                        reviewInsert,
                        r2params,
                        { outFormat: oracledb.OBJECT },
                        function (err, result) {
                            if (err) {
                                console.error(err.message);
                                doRelease(connection);
                                return;
                            }
                            console.log("CREATED REVIEW WITH ID: " + result.outBinds.outId[0]);
                            doRelease(connection);
                        }
                    )
                }
            )
        });
});


function doRelease(connection) {
    connection.release(function (err) {
        if (err) {
            console.error(err.message);
        }
    });
}
