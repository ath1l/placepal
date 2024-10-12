const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Spot = require('./models/spot');
const spot = require('./models/spot');



mongoose.connect('mongodb://localhost:27017/place-pal')
.then(() => {
    console.log("Mongo Connection open");
})
.catch(err => {
    console.log("Mongo Error");
    console.log(err);
});

/*
mongoose.connect('mongodb://localhost:27017/place-pal',{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",() => {
    console.log("Database connected");
}); */

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.get('/',(req,res) => {
    res.render('home');
})



app.get('/places',async (req,res) => {
    const spots = await Spot.find({});
    res.render('spots/index',{spots})
})

app.get('/places/new',(req,res) => {
    res.render('new'); 
})

app.post('/places',async(req,res) => {
   const place = new Spot(req.body.places);
   await place.save();
   res.redirect(`/places/${place._id}`)
})

app.get('/places/:id',async (req,res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/show',{spot})
})

app.get('/places/:id/edit',async (req,res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/edit',{spot})
})


app.put('/places/:id', async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.places }, { new: true });
    res.redirect(`/places/${spot._id}`);
});

app.delete('/places/:id', async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    res.redirect('/places');
});



app.listen(3000, () => {
    console.log("Serving on port 3000")
})

