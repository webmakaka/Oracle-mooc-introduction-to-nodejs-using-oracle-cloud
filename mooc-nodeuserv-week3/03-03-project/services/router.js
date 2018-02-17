/* Copyright © 2017 Oracle and/or its affiliates. All rights reserved. */
const express = require('express');

module.exports = function (movieController) {
    var router = express.Router();

    router.route('/')
        .get(movieController.getMovieSummary)
        .post(movieController.postMovie);

    router.route('/:movieId')
        .get(movieController.getMovie)
        .post(movieController.postReview)
        .put(movieController.putMovie)
        .delete(movieController.deleteMovie);

    router.route('/:movieId/:reviewId')
        .get(movieController.getReview)
        .put(movieController.putReview)
        .delete(movieController.deleteReview);

    return router;
};
