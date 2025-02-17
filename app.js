const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(MONGO_URL)
}

//root
app.get("/",(req,res)=>{
    res.send("Hi,I am root");
});

//test listing
app.get("/testListing",async(req,res)=>{
    let sampleListing = new Listing({
        title:"My new Villa",
        description:"By the beach",
        price:1200,
        location:"Dhaka",
        country:"Bangladesh",
    });
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Successful");
});

app.listen(8080,()=>{
    console.log(`Listening to port 8080`);
});