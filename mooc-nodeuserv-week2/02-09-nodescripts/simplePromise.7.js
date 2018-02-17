/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
function promised() {
    return new Promise(function (resolve, reject) {
        resolve("promise complete");
    });
}

promised()
    .then(function (result) {
        console.log("Empty chaining - then1: " + result);
    })
    .then(function () {
        console.log("Empty chaining - then2: ");
    })
    .then(function () {
        console.log("Empty chaining - then3: ");
    })
    .then(function () {
        console.log("Empty chaining - then4: ");
    })
    .catch(function (err) {
        console.log("Empty chaining - catch: " + err);
    });
