require("express-async-errors"); //if this module does not work then use the asyncMiddleware function in async.js
const error = require("./middleware/error");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const genres = require("./routes/genres");
const home = require("./routes/home");
const mongoose = require("mongoose");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const app = express();

// check if the jwtPrivateKey is defined
if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    // exit the application with failure status. (nonzero digit is failure)
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //url encoded key value pairs and parses it into json
app.use(express.static("public")); //serves files in public folder
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/users", users);
app.use("/api/rentals", rentals);
app.use("/api/auth", auth);

// if there is an error we get to this middleware
app.use(error);

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
