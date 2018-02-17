/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var port = process.env.PORT || 8888;

var http = require('http');

var movies = require('./movies.json');

var requestHandler = function (request, response) {
    if (request.method === 'GET') {
        if (request.url === '/') {
            response.end(JSON.stringify(movies, null, 2));
        } else {
            var index = parseInt(request.url.substr(1));
            if (index === 0 || index && movies[index]) {
                response.end(JSON.stringify(movies[index], null, 2));
            } else {
                response.statusCode = 404;
                response.end();
            }
        }
    } else if (request.method === 'POST') {
        var body = [];
        request.on('data', function (chunk) {
            body.push(chunk);
        }).on('end', function () {
            body = Buffer.concat(body).toString();
            try {
                var movie = JSON.parse(body);
                movies.push(movie);
                response.end(body);
            } catch (error) {
                response.statusCode=500;
                response.end();
            }
        });
    }
}

var server = http.createServer(requestHandler);

server.listen(port);