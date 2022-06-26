const mongoose = require("mongoose");
const Campground = require('../models/campground.js');
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");


//added the useNewUrlParser flag to 
//allow users to fall back to the old parser if they find a bug in the new parser.

/*
useCreateIndex: Again previously MongoDB used an ensureIndex function call to 
ensure that Indexes exist and, if they didn't, to create one. 
This too was deprecated in favour of createIndex. the useCreateIndex option 
ensures that you are using the new function calls.
*/
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
});

const randomGenerator = (array) => array[Math.floor(Math.random() * array.length)];
//Feeding the Database from the cities.js files
const seedDB = async () => {
    //deleting the previous stored database
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * 1000);
        const camp = new Campground(
            {
                location: cities[randomIndex].city,
                title: randomGenerator(descriptors)
            }
        )
        await camp.save();
    }
}
//Calling the seedDB to update the Database
seedDB();