const mongoose = require('mongoose');
const Spot = require('../models/spot');
const  cities = require('./cities');
const {places,descriptors} = require("./seedHelpers");

mongoose.connect('mongodb://localhost:27017/place-pal')
.then(() => {
    console.log("Mongo Connection open");
})
.catch(err => {
    console.log("Mongo Error");
    console.log(err);
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Spot.deleteMany({});
    for(let i=0;i<50;i++){
        const  random1000 = Math.floor(Math.random() * 1000);
        const place = new Spot({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city},${cities[random1000].state}`
        })
        await place.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})