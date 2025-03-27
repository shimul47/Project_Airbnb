const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
app.post("/listings",async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`); 
});
//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(`Given Data you have been deleted${deletedListing}`);
    res.redirect("/listings");
})
app.listen(8080,()=>{
    console.log(`App is listening to port 8080`);
});