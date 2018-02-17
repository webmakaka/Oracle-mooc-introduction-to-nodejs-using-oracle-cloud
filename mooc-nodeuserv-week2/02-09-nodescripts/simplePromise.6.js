/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
function promised() {
    return new Promise(function (resolve, reject) {
        resolve("promise complete");
    });
}

function brokenPromise() {
    return new Promise(function (resolve, reject) {
        reject("broken promise");
    });
}

promised()
    .then(function (result) {
        console.log("Broken promise in the middle - then1: " + result);
        return brokenPromise();
    })
    .then(function (result) {
        console.log("Broken promise in the middle - then2: " + result);
    })
    .catch(function (err) {
        console.log("Broken promise in the middle - catch: " + err);
    });
