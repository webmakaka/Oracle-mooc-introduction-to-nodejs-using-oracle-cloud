/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var faker = require('faker');
var _ = require('lodash');
var fs = require('fs');

var genres = [
    'Action',
    'Adventure',
    'Comedy',
    'Crime',
    'Drama',
    'Fantasy',
    'Historical',
    'Historical fiction',
    'Horror',
    'Magical realism',
    'Mystery',
    'Paranoid',
    'Philosophical',
    'Political',
    'Romance',
    'Saga',
    'Satire',
    'Science fiction',
    'Slice of Life',
    'Speculative',
    'Thriller',
    'Urban',
    'Western'
];
var ratings = [
    'G',
    'PG',
    'PG-13',
    'R'
]
var scores = [0, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5];

var currId = 101;

var movies = {}
_.times(30, function () {
    return {
        id: currId++,
        name: faker.company.catchPhrase(),
        year: Math.floor(Math.random() * 27) + 1990,
        studio: faker.company.companyName(),
        genre: genres[Math.floor(Math.random() * genres.length)],
        rating: ratings[Math.floor(Math.random() * ratings.length)],
        runtime: Math.floor(Math.random() * 90) + 60,
        director: faker.name.firstName() + " " + faker.name.lastName(),
        description: faker.lorem.lines((Math.random() * 3) + 1),
        reviews: _.times(Math.floor(Math.random() * 20) + 3, function () {
            return {
                name: faker.name.firstName() + " " + faker.name.lastName(),
                score: scores[Math.floor(Math.random() * scores.length)],
                date: faker.date.past(2),
                description: faker.lorem.lines((Math.random() * 3) + 1)
            }
        })
    };
}).forEach(function (m) {
    movies[m.id] = m;
});
fs.writeFile('movies.json', JSON.stringify(movies, null, 2));