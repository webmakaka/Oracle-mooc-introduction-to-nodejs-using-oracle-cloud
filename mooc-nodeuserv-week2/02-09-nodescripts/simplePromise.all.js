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
        console.log("Simple promise - then: " + result);
    })
    .catch(function (err) {
        console.log("Simple promise - catch: " + err);
    });



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


promised()
    .then(function (result) {
        console.log("Promise chain with another promise - then1: " + result);
        return new Promise(function (resolve, reject) {
            resolve("yet another");
        });
    })
    .then(function (result) {
        console.log("Promise chain with another promise - then2: " + result);
    })
    .catch(function (err) {
        console.log("Promise chain with return values - catch: " + err);
    });


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
