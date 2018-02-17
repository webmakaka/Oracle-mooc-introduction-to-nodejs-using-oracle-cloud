/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
function promised() {
    return new Promise(function (resolve, reject) {
        resolve("promise complete");
    });
}

promised()
    .then(function (result) {
        console.log("Simple promise - then: " + result);
    })
    .catch(function (err) {
        console.log("Simple promise - catch: " + err);
    });
