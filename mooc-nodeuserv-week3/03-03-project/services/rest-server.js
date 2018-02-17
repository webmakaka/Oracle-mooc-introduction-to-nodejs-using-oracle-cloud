/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var express = require('express');
var bodyParser = require('body-parser');

function start(config, router) {
    var app = express();

    app.use(bodyParser.json());

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    })

    app.use("/", router);

    var server = app.listen(config.server.port);
}

module.exports.start = start;




