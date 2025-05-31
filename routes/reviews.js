const express = require('express');
const router = express.Router({ mergeParams : true });
const Spot = require('../models/spot');
const Review = require('../models/review');
const places = require('../routes/places');
const { validateReview , isLoggedIn , isReviewAuthor } = require('../middleware')
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { placeSchema , reviewSchema } = require('../schemas.js');
const reviews = require('../controllers/reviews');




router.post('/', isLoggedIn , validateReview , catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn ,isReviewAuthor , reviews.deleteReview);

module.exports = router;
