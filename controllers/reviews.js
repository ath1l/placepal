const Spot = require('../models/spot');
const Review = require('../models/review');

module.exports.createReview = async (req,res) => {
    const spot = await Spot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    req.flash('success','review added!');
    res.redirect(`/places/${spot._id}`);
}

module.exports.deleteReview = async (req,res) => {
    Spot.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','review deleted Succesfully !');    
    res.redirect(`/places/${req.params.id}`);
}