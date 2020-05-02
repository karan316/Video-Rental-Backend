const winston = require("winston");
const express = require("express");
const app = express();
require("./startup/logging")(); // this should be required before everything else
require("./startup/routes")(app); // routes returns a function. we call it with the app object
require("./startup/db")();
require("./startup/cors")(app);
require("./startup/config");
require("./startup/validation");
require("./startup/prod")(app);

const port = process.env.PORT || 3900;

const server = app.listen(port, () =>
    winston.info(`Listening on port ${port}`)
);

module.exports = server;
