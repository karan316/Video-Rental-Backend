const error = require("../middleware/error");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const express = require("express");

module.exports = function (app) {
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
};
