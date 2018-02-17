/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
// THIS CODE DOESNT RUN, IT IS JUST A TEMPLATE FOR REFERENCE!
var oracledb = require('oracledb');

oracledb.autoCommit = true;

const connProperties = {
    connectString: "localhost/orcl",
    user: "movies_usr",
    password: "oracle"
}

oracledb.getConnection(connProperties)
    .then(function (connection) {
        connection.execute(
            QUERY, //SQL QUERY
            PARAMETERS, //SQL QUERY PARAMETERS OR EMPTY OBJECT/ARRAY if none
            { outFormat: oracledb.OBJECT }
        ).then(function (result) {
            //HANDLE RESULT AND OPTIONALLY RETURN ANOTHER EXECUTION ON THE DB
        }).then(function () {
            // COMMIT TRANSACTIONS
            return connection.commit();
        }).then(function () {
            // RELEASE CONNECTIONS
            doRelease(connection);
        }).catch(function (err) {
            console.error(err.message);
            connection.rollback(function () {
                doRelease(connection)
            });
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
