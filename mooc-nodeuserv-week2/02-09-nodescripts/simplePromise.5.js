/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
function brokenPromise() {
    return new Promise(function (resolve, reject) {
        reject("broken promise");
    });
}

brokenPromise()
    .then(function (result) {
        console.log("Broken promise - then1: " + result);
        return new Promise(function (resolve, reject) {
            resolve("yet another");
        });
    })
    .then(function (result) {
        console.log("Broken promise - then2: " + result);
    })
    .catch(function (err) {
        console.log("Broken promise - catch: " + err);
    });
