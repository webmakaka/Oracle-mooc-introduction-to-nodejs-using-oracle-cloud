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

oracledb.getConnection(connProperties, function (err, connection) {
    if (err) {
        console.error(err.message);
        return;
    }
    connection.execute(
        sqlSelect,
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
                return;
            }
            console.log(JSON.stringify(result.rows, null, 2));
            connection.release(function (err) {
                if (err) {
                    console.error(err.message);
                }
            });
        });
});