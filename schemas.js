
const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)

module.exports.placeSchema = joi.object({
    places: joi.object({
        title: joi.string().required().escapeHTML(), //name in form was place[title]
       // image: joi.string().required(),
        price:joi.number().required().min(0),
        location: joi.string().required().escapeHTML(),
        description: joi.string().required().escapeHTML(),
}),
 deleteImages: joi.array().items(joi.string())
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required().escapeHTML(),
        rating: joi.number().required().min(1).max(5)
    })
})





