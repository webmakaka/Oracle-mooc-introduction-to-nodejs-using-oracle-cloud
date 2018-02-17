/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var count = 100;

function promised() {
    return new Promise(function (resolve, reject) {
        resolve(count++);
    });
}

var p = promised();
p = p.then(function (result) {
    console.log(result);
    return promised();
});
p = p.then(function (result) {
    console.log(result);
});
p = p.then(function (result) {
    console.log(result);
    return promised();
});
p = p.then(function (result) {
    console.log(result);
    return promised();
});
p = p.catch(function (err) {
    console.log("Simple promise - catch: " + err);
});
