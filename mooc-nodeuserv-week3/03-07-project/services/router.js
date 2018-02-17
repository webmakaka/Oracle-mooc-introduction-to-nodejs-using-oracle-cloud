const express = require('express');

module.exports = function (movieController) {
    var router = express.Router();

    router.route('/')
        .get(function (request, response) {
            response.send("OK");
        });

    router.route('/movies/')
        .get(movieController.getMovieSummary)
        .post(movieController.postMovie);

    router.route('/movies/:movieId')
        .get(movieController.getMovie)
        .post(movieController.postReview)
        .put(movieController.putMovie)
        .delete(movieController.deleteMovie);

    router.route('/movies/:movieId/:reviewId')
        .get(movieController.getReview)
        .put(movieController.putReview)
        .delete(movieController.deleteReview);

    return router;
};
