const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn , isAuthor , validateSpot} = require('../middleware');
const places = require('../controllers/places')
const Spot = require('../models/spot');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(places.index))
    .post( isLoggedIn,upload.array('image'),validateSpot, catchAsync (places.createPlace));
 

router.get('/new', isLoggedIn ,places.renderNewForm)

router.route('/:id')
    .get(catchAsync(places.showPlace))
    .put(isLoggedIn, isAuthor , upload.array('image') , validateSpot, catchAsync(places.updatePlace))
    .delete(isLoggedIn , isAuthor , catchAsync(places.deletePlace));

router.get('/:id/edit',isLoggedIn, isAuthor ,places.renderEditForm);

module.exports = router; 