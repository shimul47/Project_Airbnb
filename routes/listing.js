const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//index route
router.get("/",async(req,res)=> {
    const allListings = await Listing.find({});
        res.render("listings/index.ejs",{ allListings });
    });

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});



//show route-- will show all data of a user
router.get("/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
});

//create new route
router.post("/",validatelisting,
    wrapAsync(async(req,res,next)=>{
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
     
    
}));
//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id",validatelisting,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`); 
}));
//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(`Given Data you have been deleted${deletedListing}`);
    res.redirect("/listings");
}));

module.exports = router;