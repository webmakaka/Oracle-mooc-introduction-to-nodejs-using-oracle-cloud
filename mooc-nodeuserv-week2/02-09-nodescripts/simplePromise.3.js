/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
function promised() {
    return new Promise(function (resolve, reject) {
        resolve("promise complete");
    });
}

promised()
    .then(function (result) {
        console.log("Promise chain with exception - then1: " + result);
        throw "THROWN EXCEPTION!";
    })
    .then(function (result) {
        console.log("Promise chain with exception - then2: " + result);
    })
    .catch(function (err) {
        console.log("Promise chain with exception - catch: " + err);
    });
