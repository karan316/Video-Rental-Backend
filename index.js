const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const genres = require("./routes/genres");
const home = require("./routes/home");
const mongoose = require("mongoose");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //url encoded key value pairs and parses it into json
app.use(express.static("public")); //serves files in public folder
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/", home);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));

mongoose
    .connect("mongodb://localhost/vidly-database", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Connected to MongoDB...");
    })
    .catch((err) => {
        console.error("Could not connect to MongoDB..", err);
    });
