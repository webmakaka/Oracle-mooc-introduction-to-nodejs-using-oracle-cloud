/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
// Select reviews, in this case I select a movies with its reviews,
// change the ID, 
// this only works on the vm!
var oracledb = require('oracledb');

oracledb.autoCommit = true;

//change this or use command line args!
const id = process.argv[2] || 199;

const sqlSelectMovies = "SELECT * FROM MOVIES WHERE MOVIEID = " + id;
const sqlSelectReviews = "SELECT * FROM REVIEWS WHERE MOVIEID = " + id;

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
        sqlSelectMovies,
        [],
        { outFormat: oracledb.OBJECT },
        function (err, result) {
            if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
            }
            if (!result.rows.length) {
                console.log("no movie with that id");
                doRelease(connection);
                return;
            }
            var movie = result.rows[0];
            connection.execute(
                sqlSelectReviews,
                [],
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    movie.reviews = result.rows;
                    console.log(JSON.stringify(movie, null, 2))
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
