/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
// Select reviews, in this case I select a movies with its reviews, change the ID, this only works on the vm!
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

oracledb.getConnection(connProperties, function (err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
    connection.execute(
        sqlDeleteMovies,
        { movieId: id },
        { outFormat: oracledb.OBJECT },
        function (err, result) {
            if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
            }
            connection.execute(
                sqlDeleteReviews,
                { movieId: id },
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    console.log("Movie and reviews with id " + id + " deleted!");
                    doRelease(connection);
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
