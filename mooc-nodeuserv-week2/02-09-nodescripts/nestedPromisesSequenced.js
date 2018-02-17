/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
function promised() {
    return new Promise(function (resolve, reject) {
        resolve("promise complete");
    });
}

promised()
    .then(function (result) {
        console.log("Promise1-then1: " + result);
        return promised()
            .then(function (result2) {
                console.log("Promise2-then1: " + result2);
                return "return from promise2-then1"
            }).then(function (result2) {
                console.log("Promise2-then2: " + result2);
                return "return from promise2-then2"
            }).then(function (result2) {
                console.log("Promise2-then3: " + result2);
            });
    }).then(function (result) {
        console.log("Promise1-then2: " + result);
    }).catch(function (err) {
        console.log("Simple promise - catch: " + err);
    });
