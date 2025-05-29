const User = require("../models/user.js");

module.exports.rendersignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
        try{
            let{username,email,password} = req.body;
            const newUser = new User({email,username});
            const registeredUser = await User.register(newUser,password);
            // console.log(registeredUser);
            req.login(registeredUser,(err)=>{
                if(err){
                    return next(err);
                }
                req.flash("success","Registration successful");
                res.redirect("/listings");
            })
            
        }catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
        }  
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Successfully logged in!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo; // Clean up
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successful!");
        res.redirect('/listings');
    })
}