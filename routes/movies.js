const express = require("express");
const router = express.Router();
const { Genre } = require("../models/genre");
const { Movie, validateMovie } = require("../models/movie");

router.get("/", async (req, res) => {
    const movies = await Movie.find().sort("title");
    res.send(movies);
});

router.get("/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        res.status(404).send("Movie with the given id not found");
        return;
    }

    res.send(movie);
});

router.post("/", async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // doubt here. how do we get the genreId?
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre..");

    const movie = new Movie({
        title: req.body.title,
        // store only name of the genre
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });
    // no need to catch the return of save as object id is already assigned.
    await movie.save();
    res.send(movie);
});

router.put("/:id", async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) {
        res.status(400).send("Movie with the given id not found");
        return;
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre..");

    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            // store only name of the genre
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        },
        { new: true }
    );

    if (!movie) {
        res.status(404).send("Movie with the given id not found");
        return;
    }
    res.send(movie);
});

router.delete("/:id", async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) {
        res.status(404).send("Movie with the given id not found");
        return;
    }
    res.send(movie);
});

module.exports = router;
