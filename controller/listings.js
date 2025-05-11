const Listing = require("../models/listing")
module.exports.index = async(req,res)=> {
    const allListings = await Listing.find({});
        res.render("listings/index.ejs",{ allListings });
    }
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing = (async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{
        path:"author",
    }})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you are requested for doesn't exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
})

module.exports.createListing =async(req,res,next)=>{ 
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are requested for doesn't exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`); 
}

module.exports.distroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    console.log(`Given Data you have been deleted${deletedListing}`);
    res.redirect("/listings");
}