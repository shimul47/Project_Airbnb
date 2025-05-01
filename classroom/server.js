const express = require("express");
const app = express();
const session = require("express-session");
//npm i express-session
//npm i connect-flash
const flash = require("connect-flash");
const path = require("path");

const sessionOptions = {
    secret : "mysupersecretstring",
     resave:false, 
     saveUninitialized:true
}

app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.suc = req.flash("success");
    res.locals.err = req.flash("err");
    next();
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.get("/register",(req,res)=>{
    let{name = "annoymous"} = req.query;
    req.session.name = name;
    if(name === "annoymous"){
        req.flash("err","provide valid name for registration");
    }else{
        req.flash("success", "user register successfully");
    }
    res.redirect("/hello");

});

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name});
});
// app.get("/test",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
    
//     res.send(`you send req ${req.session.count} times`);
// });

app.listen(3000,()=>{
    console.log("server is listening 3000");
});