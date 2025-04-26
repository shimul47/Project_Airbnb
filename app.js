const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema ,revireSchema} = require("./schema.js");

const Review = require("./models/review.js");

main().then(()=>{
    console.log("connceted")
})
.catch((err)=>{
    console.log(err);
});
async function main(params) {
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Hi, I am root");
});

// app.get("/testlisting",async(req,res)=>{
//     let samplelisting = new Listing({
//         title:"My New villa",
//         description:"By the Beach",
//         price:1200,
//         location:"California",
//         country:"USA",
//     });
//     await samplelisting.save();
//     console.log("sample was saves");
//     res.send("Succesfull testing");
// });
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//here we are using Joi api as a function to identify error
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

const validateReview= (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    // console.log(result);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
//index route
app.get("/listings",async(req,res)=> {
    const allListings = await Listing.find({});
        res.render("listings/index.ejs",{ allListings });
    });

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});



//show route-- will show all data of a user
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//create new route
app.post("/listings",validatelisting,
    wrapAsync(async(req,res,next)=>{
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
     
    
}));
//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",validatelisting,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`); 
}));
//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(`Given Data you have been deleted${deletedListing}`);
    res.redirect("/listings");
}));
//Reviews
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("Saved");
    res.redirect(`/listings/${listing._id}`);
    

}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next)=>{
    let{statusCode,message} = err;
    res.status(statusCode).render("Error.ejs",{err});
    // res.status(statusCode=500).send(message="Page not found");
})
app.listen(8080,()=>{
    console.log(`App is listening to port 8080`);
});