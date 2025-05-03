module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url
        req.sessoion.redirectUrl = req.originalUrl;
        req.flash("error","Login to create listing");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.sessoion.redirectUrl){
        res.locals.redirectUrl = req.sessoion.redirectUrl;
    };
    next();
};