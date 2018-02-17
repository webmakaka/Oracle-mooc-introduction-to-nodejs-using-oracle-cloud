/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var server = require("./services/rest-server.js");
var config = require("./config/config.js");
var data = require("./data/inmemory.js");

server.start(config, data);