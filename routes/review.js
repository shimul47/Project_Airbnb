const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");

const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");



//Reviews
router.post("/",
    isLoggedIn, 
    validateReview, 
    wrapAsync(async(req,res,next)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    // console.log("Saved");
    res.redirect(`/listings/${listing._id}`);
    

}));
//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;