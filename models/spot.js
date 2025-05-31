const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const { ref } = require('joi');

const ImageSchema = new Schema({
            url: String,
            filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload','/upload/w_200');
});

const opts = { toJSON: { virtuals: true }};

ImageSchema.set('toObject', { virtuals: true });
ImageSchema.set('toJSON', { virtuals: true });

const SpotSchema = new Schema({
    title: { type: String, required: true },
    images: [ImageSchema],
    geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
         }
},
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number'],
        validate: {
            validator: function (value) {
                return typeof value === 'number' && !isNaN(value);
            },
            message: '{VALUE} is not a valid number!'
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

SpotSchema.virtual('properties.popUpMarkup').get(function () {
    return '<a href="/places/${this._id}">${this.title}</a>';
});

SpotSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})  

module.exports = mongoose.model('Spot',SpotSchema);









