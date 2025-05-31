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
        const price = Math.floor(Math.random() * 20) + 10;
        const place = new Spot({
          //your author id
            author: '67fa07c251b6cb74a49f1582',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city},${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, cumque.',
            price: price,
            geometry: {
                type: 'Point',
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images:  [
                {
                  url: 'https://res.cloudinary.com/dh2p1iulu/image/upload/v1745059287/placePal/dnc0fhubpcgxyir2y1d2.png',
                  filename: 'placePal/dnc0fhubpcgxyir2y1d2',
                },
                {
                  url: 'https://res.cloudinary.com/dh2p1iulu/image/upload/v1745059299/placePal/b3mcm6ggjrjlnknxu4cz.png',
                  filename: 'placePal/b3mcm6ggjrjlnknxu4cz',
                },
                {
                  url: 'https://res.cloudinary.com/dh2p1iulu/image/upload/v1745059301/placePal/ssfeol6bps2y0u26uemm.png',
                  filename: 'placePal/ssfeol6bps2y0u26uemm',
                },
                {
                  url: 'https://res.cloudinary.com/dh2p1iulu/image/upload/v1745059304/placePal/wta1wsj81thxbzsoxjx3.png',
                  filename: 'placePal/wta1wsj81thxbzsoxjx3',
                }
              ]
        })
        await place.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})