const Spot = require('../models/spot');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const { cloudinary } = require("../cloudinary");

const { places } = require('../seeds/seedHelpers');



module.exports.index = async (req,res) => {
    const spots = await Spot.find({});
    res.render('spots/index',{spots})
}

module.exports.renderNewForm = (req,res) => {
    res.render('spots/new');  
}

module.exports.createPlace = async(req,res,next) => {
    //if(!req.body.places) throw new ExpressError('Invalid Place Data',400);
      const geoData = await maptilerClient.geocoding.forward(req.body.places.location, { limit: 1 });
      const spot = new Spot(req.body.places);
      spot.geometry = geoData.features[0].geometry;
      spot.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
      spot.author = req.user._id;
      await spot.save();
      console.log(spot);
      req.flash('success','Succesfully made a new place!');
      res.redirect(`/places/${spot._id}`)
   }

module.exports.showPlace = async (req, res) => {
    const spot = await Spot.findById(req.params.id)
    .populate({path:'reviews' , populate: {
     path: 'author'
    }}).populate('author');
   console.log(spot);
    if (!spot) {
        req.flash('error', 'Cannot find that place!');
        return res.redirect('/places'); 
    }
    res.render('spots/show', { spot });
}

module.exports.renderEditForm =  async (req,res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    if (!spot) {
        req.flash('error', 'Cannot find that place!');
        return res.redirect('/places'); 
    }
    res.render('spots/edit',{spot})
}

module.exports.updatePlace = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.places }, { new: true });
    const geoData = await maptilerClient.geocoding.forward(req.body.places.location, { limit: 1 });
    spot.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    spot.images.push(...imgs);
    await spot.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages)
            {
               await cloudinary.uploader.destroy(filename);
            }
        await spot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages  } }} });
        console.log(spot);
    }
    req.flash('success','Succesfully updated!'); 
    console.log("Rendering edit form for spot:", spot);
    res.redirect(`/places/${spot._id}`);
}

module.exports.deletePlace = async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    req.flash('success','place deleted Succesfully !');    
    res.redirect('/places');
}