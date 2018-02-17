/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
var oracledb = require('oracledb');
var commons = require('./commons.js');

const sqlSelectSummary = "SELECT MOVIES.*, " +
    "(SELECT COUNT(*)FROM REVIEWS WHERE REVIEWS.MOVIEID = MOVIES.MOVIEID) AS REVIEWCOUNT," +
    "(SELECT AVG(SCORE)FROM REVIEWS WHERE REVIEWS.MOVIEID = MOVIES.MOVIEID) AS REVIEWAVG " +
    "FROM MOVIES";

const sqlSelectMovie = "SELECT * FROM MOVIES WHERE MOVIEID = :movieId";

const sqlSelectReview = "SELECT * FROM REVIEWS WHERE MOVIEID = :movieId AND REVIEWID = :reviewId";

const sqlSelectReviews = "SELECT * FROM REVIEWS WHERE MOVIEID = :movieId";

const sqlMovieInsert = "INSERT INTO MOVIES(MOVIEID, MOVIENAME, YEAR, STUDIO, GENRE, RATING, RUNTIME, DIRECTOR, MOVIEDESCRIPTION) " +
    "VALUES (MOVIES_SEQ.NEXTVAL, :name, :year, :studio, :genre, :rating, :runtime, :director, :description) " +
    "RETURNING MOVIEID INTO :outId";

const sqlReviewInsert = "INSERT INTO REVIEWS(REVIEWID, MOVIEID, REVIEWERNAME, SCORE, REVIEWDATE, REVIEWDESCRIPTION) " +
    "VALUES (REVIEWS_SEQ.NEXTVAL, :movieId, :name, :score, :revdate, :description) " +
    "RETURNING REVIEWID INTO :outId";

const sqlMovieUpdate = "UPDATE MOVIES SET MOVIENAME=:name, YEAR=:year, STUDIO=:studio, GENRE=:genre, RATING=:rating, RUNTIME=:runtime, DIRECTOR=:director, MOVIEDESCRIPTION=:description " +
    "WHERE MOVIEID=:movieId ";

const sqlReviewUpdate = "UPDATE REVIEWS SET REVIEWERNAME=:name, SCORE=:score, REVIEWDATE=:revdate, REVIEWDESCRIPTION=:description " +
    "WHERE MOVIEID=:movieId AND REVIEWID=:reviewId";

const sqlDeleteMovie = "DELETE FROM MOVIES WHERE MOVIEID = :movieId";

const sqlDeleteReviews = "DELETE FROM REVIEWS WHERE MOVIEID = :movieId";

const sqlDeleteReview = "DELETE FROM REVIEWS WHERE MOVIEID = :movieId AND REVIEWID = :reviewId";

module.exports.getSummaries = function (connection) {
    return connection.execute(
        sqlSelectSummary,
        [],
        { outFormat: oracledb.OBJECT }
    ).then(function (result) {
        var summary = [];
        result.rows.forEach(function (row) {
            summary.push({
                id: row.MOVIEID,
                name: row.MOVIENAME,
                year: row.YEAR,
                studio: row.STUDIO,
                genre: row.GENRE,
                rating: row.RATING,
                runtime: row.RUNTIME,
                director: row.DIRECTOR,
                description: row.MOVIEDESCRIPTION,
                reviews: row.REVIEWCOUNT,
                score: row.REVIEWAVG
            });
        });
        return summary;
    });
}

module.exports.getMovie = function (connection, movieId) {
    var movie;
    return connection.execute(
        sqlSelectMovie,
        { movieId: movieId },
        { outFormat: oracledb.OBJECT })
        .then(function (result) {
            movie = toMovie(result);
            return connection.execute(
                sqlSelectReviews,
                { movieId: movieId },
                { outFormat: oracledb.OBJECT });
        }).then(function (result) {
            movie.reviews = result.rows.map(toReview);
            return movie;
        });
}

module.exports.getReview = function (connection, movieId, reviewId) {
    return connection.execute(
        sqlSelectReview,
        {
            movieId: movieId,
            reviewId: reviewId
        },
        { outFormat: oracledb.OBJECT })
        .then(function (result) {
            if (result.rows.length) {
                return toReview(result.rows[0]);
            } else {
                throw commons.errors.NOT_FOUND;
            }
        });
}

module.exports.addMovie = function (connection, movie) {
    return connection.execute(
        sqlMovieInsert,
        {
            name: movie.name,
            year: movie.year,
            studio: movie.studio,
            genre: movie.genre,
            rating: movie.rating,
            runtime: movie.runtime,
            director: movie.director,
            description: movie.description,
            outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        },
        { outFormat: oracledb.OBJECT })
        .then(function (result) {
            return result.outBinds.outId[0];
        });
}

module.exports.addReview = function (connection, movieId, review) {
    return connection.execute(
        sqlReviewInsert,
        {
            movieId: movieId,
            name: review.name,
            score: review.score,
            revdate: review.date,
            description: review.description,
            outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        }
    ).then(function (result) {
        return result.outBinds.outId[0];
    });
}

module.exports.updateMovie = function (connection, movieId, movie) {
    return connection.execute(
        sqlMovieUpdate,
        {
            name: movie.name,
            year: movie.year,
            studio: movie.studio,
            genre: movie.genre,
            rating: movie.rating,
            runtime: movie.runtime,
            director: movie.director,
            description: movie.description,
            movieId: movieId
        },
        { outFormat: oracledb.OBJECT }
    ).then(function (result) {
        return "OK";
    });

}

module.exports.updateReview = function (connection, movieId, reviewId, review) {
    return connection.execute(
        sqlReviewUpdate,
        {
            name: review.name,
            score: review.score,
            revdate: review.date,
            description: review.description,
            movieId: movieId,
            reviewId: reviewId
        },
        { outFormat: oracledb.OBJECT }
    ).then(function (result) {
        return "OK";
    });

}

module.exports.removeMovie = function (connection, movieId) {
    return connection.execute(
        sqlDeleteMovie,
        { movieId: movieId },
        { outFormat: oracledb.OBJECT }
    ).then(function (result) {
        return connection.execute(
            sqlDeleteReviews,
            { movieId: movieId },
            { outFormat: oracledb.OBJECT });
    }).then(function (result) {
        return "OK"
    });
}

module.exports.removeReview = function (connection, movieId, reviewId) {
    return connection.execute(
        sqlDeleteReview,
        {
            movieId: movieId,
            reviewId: reviewId
        },
        { outFormat: oracledb.OBJECT }
    ).then(function (result) {
        return "OK"
    });
}

// Helper functions

function toMovie(result) {
    if (result.rows.length == 0) {
        throw commons.errors.NOT_FOUND;
    }
    var row = result.rows[0];
    return {
        id: row.MOVIEID,
        name: row.MOVIENAME,
        year: row.YEAR,
        studio: row.STUDIO,
        genre: row.GENRE,
        rating: row.RATING,
        runtime: row.RUNTIME,
        director: row.DIRECTOR,
        description: row.MOVIEDESCRIPTION,
    };
}

function toReview(row) {
    return {
        movie: row.MOVIEID,
        id: row.REVIEWID,
        name: row.REVIEWERNAME,
        score: row.SCORE,
        description: row.REVIEWDESCRIPTION,
        date: row.REVIEWDATE
    };
}
