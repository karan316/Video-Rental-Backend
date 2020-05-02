const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
    // throw new Error("Could not get genres..");
    const genres = await Genre.find().sort("name");
    res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    // if genre with given id does not exist
    if (!genre) {
        res.status(404).send("Genre with the given id not found");
        return;
    }
    res.send(genre);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let genre = new Genre({
        name: req.body.name,
    });
    Genre.drop;
    genre = await genre.save();
    res.send(genre);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    } //validate the request first

    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    );
    if (!genre) {
        res.status(404).send("Genre with the given id not found");
        return;
    }

    res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) {
        res.status(404).send("Genre with the given id not found");
        return;
    }
    res.send(genre);
});

module.exports = router;
