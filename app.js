const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError = require("./utils/ExpressError.js");
const reviews = require("./routes/review.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash")

const sessionOptions = {
    secret : "mysupersecretstring",
     resave:false, 
     saveUninitialized:true,
     cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
     }
};

app.get("/",(req,res)=>{
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

main().then(()=>{
    console.log("connceted")
})
.catch((err)=>{
    console.log(err);
});
async function main(params) {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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
