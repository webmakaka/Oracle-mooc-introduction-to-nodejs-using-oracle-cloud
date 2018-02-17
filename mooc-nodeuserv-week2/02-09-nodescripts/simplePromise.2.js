/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
function promised() {
    return new Promise(function (resolve, reject) {
        resolve("promise complete");
    });
}

promised()
    .then(function (result) {
        console.log("Promise chain with return values - then1: " + result);
        return "another"
    })
    .then(function (result) {
        console.log("Promise chain with return values - then2: " + result);
    })
    .catch(function (err) {
        console.log("Promise chain with return values - catch: " + err);
    });
