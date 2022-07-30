const campground = require('../models/campground.js');
const Campground = require('../models/campground.js');
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}

module.exports.renderNewForm = (req, res, next) => {
    res.render("campgrounds/new.ejs");
}

module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground)
    //     throw new ExpressErrors('Invalid camp data', 400);

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    console.log(geoData.body.features);
    res.send("OK");

    // const camp = new Campground(req.body.campground);
    // camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    // camp.author = req.user._id;
    // await camp.save();
    // var s = "/campgrounds/" + camp._id;
    // req.flash('success', 'successfully made a new campground');
    // res.redirect(s);
}

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }

    }).populate('author');
    if (!campground) {
        req.flash('error', 'Unable to find the campground');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { campground });
}

module.exports.renderEditForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Unable to find the campground');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit.ejs", { campground });
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    console.log(req.body.deleteImages);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'successfully updated a new campground');
    res.redirect("/campgrounds/" + camp._id);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect("/campgrounds");
}