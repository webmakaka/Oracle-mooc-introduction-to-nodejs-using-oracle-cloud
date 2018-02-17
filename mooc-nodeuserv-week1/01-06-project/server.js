/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var PORT = process.env.PORT || 8888;

var http = require('http');

var requestHandler = function(request, response){
    console.log(request.url);
    response.end("Hello World!");
}

var server = http.createServer(requestHandler);

server.listen(port);