const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    //this the the model in which genre will be stored in the movies table
    genre: {
        type: genreSchema,
        ref: "Genre",
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
});

const Movie = mongoose.model("Movie", movieSchema);

// this is what the client sends us. the input to the API
function validateMovie(movie) {
    const schema = {
        title: Joi.string().required().min(3).max(50),
        genreId: Joi.objectId().required(), //client only sends the id of the genre
        numberInStock: Joi.number().required().min(0).max(100),
        dailyRentalRate: Joi.number().required().min(0).max(100),
    };
    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validateMovie = validateMovie;
