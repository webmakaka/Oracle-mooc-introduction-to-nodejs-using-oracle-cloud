/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var oracledb = require('oracledb');

oracledb.autoCommit = true;

//change this or use command line args!
const id = process.argv[2] || 199;

const sqlDeleteMovies = "DELETE FROM MOVIES WHERE MOVIEID = :movieId";
const sqlDeleteReviews = "DELETE FROM REVIEWS WHERE MOVIEID = :movieId";

const connProperties = {
    connectString: "localhost/orcl",
    user: "movies_usr",
    password: "oracle"
};

oracledb.getConnection(connProperties)
    .then(function (connection) {
        connection.execute(
            sqlDeleteMovies,
            { movieId: id },
            { outFormat: oracledb.OBJECT })
            .then(function (result) {
                console.log("Movie id " + id + " deleted!");
                return connection.execute(
                    sqlDeleteReviews,
                    { movieId: id },
                    { outFormat: oracledb.OBJECT });
            }).then(function (result) {
                console.log("Reviews for movie with id " + id + " deleted!");
                doRelease(connection);
            }).catch(function (err) {
                console.error(err.message);
                shared.doRelease(connection);
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
