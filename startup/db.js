const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
    mongoose
        .connect("mongodb://localhost/vidly-database", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        .then(() => {
            winston.info("Connected to MongoDB...");
        });
};
