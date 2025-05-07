const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connceted to db");
})
.catch((err)=>{
    console.log(err);
});
async function main(params) {
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({}),
    initData.data = initData.data.map((obj) =>({...obj,
    owner:"681ba447d9525a3bce8a5a59"
    }));    
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};
initDB();
