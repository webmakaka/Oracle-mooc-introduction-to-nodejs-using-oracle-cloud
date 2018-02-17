/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var express = require('express');
var bodyParser = require('body-parser');

function start(config, router) {
    var app = express();

    app.use(bodyParser.json());

    app.use("/", router);

    var server = app.listen(config.server.port);
}

module.exports.start = start;

