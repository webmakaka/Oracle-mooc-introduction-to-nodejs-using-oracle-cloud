/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
// Select reviews, in this case I select a movies with its reviews,
// change the ID, 
// this only works on the vm!
var oracledb = require('oracledb');

oracledb.autoCommit = true;

const sqlSelectMovies = "SELECT * FROM MOVIES WHERE MOVIEID = :movieId";
const sqlSelectReviews = "SELECT * FROM REVIEWS WHERE MOVIEID = :movieId";

//change this or use command line args!
const id = process.argv[2] || 101;

const connProperties = {
    connectString: "localhost/orcl",
    user: "movies_usr",
    password: "oracle"
};

oracledb.getConnection(connProperties)
    .then(function (connection) {
        var movie;
        connection.execute(
            sqlSelectMovies,
            { movieId: id },
            { outFormat: oracledb.OBJECT })
            .then(function (result) {
                if (!result.rows.length) {
                    throw "Movie does not exist!";
                } else {
                    return result.rows[0];
                }
            }).then(function (result) {
                movie = result;
            }).then(function () {
                return connection.execute(
                    sqlSelectReviews,
                    { movieId: id },
                    { outFormat: oracledb.OBJECT });
            }).then(function (result) {
                movie.reviews = result.rows;
                return movie;
            }).then(function (movie) {
                console.log(JSON.stringify(movie, null, 2));
            }).then(function () {
                doRelease(connection);
            }).catch(function (err) {
                doRelease(connection);
                console.error(err);
            });
    }).catch(function (err) {
        console.error(err.message);
    });

function doRelease(connection) {
    connection.release(function (err) {
        if (err) {
            console.error(err.message);
        }
    });
}
