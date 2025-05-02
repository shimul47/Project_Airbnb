const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    //we also want to store username and password but mongoose do it automatically.
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);