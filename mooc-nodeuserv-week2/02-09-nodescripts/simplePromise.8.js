/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
function promised() {
    return new Promise(function (resolve, reject) {
        resolve("promise complete");
    });
}

var futurePromise = promised();
futurePromise = futurePromise.then(function (result) {
    console.log("Promise Variable - then1: " + result);
});
for (var i = 0; i < 5; i++) {
    (function (i) {
        futurePromise = futurePromise.then(function (result) {
            console.log("Promise Variable - then " + i + " previous " + result);
            return i;
        });
    })(i);
}
