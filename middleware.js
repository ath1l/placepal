const { placeSchema , reviewSchema} = require('./schemas.js');
const ExpressError  =require('./utils/ExpressError')
const Spot = require('./models/spot')
const Review  = require('./models/review')

module.exports.isLoggedIn = (req,res,next) => {
    console.log("isLoggedin called");
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateSpot = (req,res,next) => {
    const result = placeSchema.validate(req.body)
    if(result.error){
        const msg = result.error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(req,res, next) => {
    console.log('isAuthor middleware called');
    const { id } = req.params;
    const spot = await Spot.findById(id);
    if(!spot.author.equals(req.user._id)) {
        req.flash('error',"You do not have the permission to do that!");
        return res.redirect(`/places/${id}`);
    next();
 }
 next();
 }


 module.exports.validateReview = (req,res,next) => {
     const result = reviewSchema.validate(req.body)
     if(result.error){
         const msg = result.error.details.map(el => el.message).join(',')
         throw new ExpressError(msg,400)
     }
     else{
         next();
     }
 }

 module.exports.isReviewAuthor = async(req,res, next) => {
    console.log('isReviewAuthor middleware called');
    const { id , reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error',"You do not have the permission to do that!");
        return res.redirect(`/places/${id}`);
 }
 next();
 }
