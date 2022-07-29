const Campground = require('../models/campground.js');

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}

module.exports.renderNewForm = (req, res, next) => {
    res.render("campgrounds/new.ejs");
}

module.exports.createCampground = async (req, res, next) => {
    if (!req.body.campground)
        throw new ExpressErrors('Invalid camp data', 400);
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    var s = "/campgrounds/" + camp._id;
    req.flash('success', 'successfully made a new campground');
    res.redirect(s);
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
    console.log(req.params.id);
    res.render("campgrounds/edit.ejs", { campground });
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body.campground);
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'successfully updated a new campground');
    res.redirect("/campgrounds/" + camp._id);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect("/campgrounds");
}