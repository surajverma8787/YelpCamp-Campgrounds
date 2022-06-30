const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

//This is basically a constructor for model Campgrounds;
module.exports = mongoose.model('Campgrounds', CampgroundSchema);