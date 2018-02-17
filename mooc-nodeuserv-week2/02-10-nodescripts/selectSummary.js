/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
// Select for the summaries, this only works on the vm!
var oracledb = require('oracledb');

oracledb.autoCommit = true;

const sqlSelect = "SELECT MOVIES.*, " +
    "(SELECT COUNT(*)FROM REVIEWS WHERE REVIEWS.MOVIEID = MOVIES.MOVIEID) AS REVIEWCOUNT," +
    "(SELECT AVG(SCORE)FROM REVIEWS WHERE REVIEWS.MOVIEID = MOVIES.MOVIEID) AS REVIEWAVG " +
    "FROM MOVIES";

const connProperties = {
    connectString: "localhost/orcl",
    user: "movies_usr",
    password: "oracle"
}

oracledb.getConnection(connProperties)
    .then(function (connection) {
        connection.execute(
            sqlSelect,
            [],
            { outFormat: oracledb.OBJECT }
        ).then(function (result) {
            console.log(JSON.stringify(result.rows, null, 2));
            doRelease(connection);
        }).catch(function (err) {
            console.error(err.message);
            doRelease(connection);
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
