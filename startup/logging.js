const winston = require("winston");
// require("winston-mongodb");
//if this module does not work then use the asyncMiddleware function in async.js
require("express-async-errors");
module.exports = function () {
    // use winston to log any other unhandled exceptions
    winston.exceptions.handle(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.prettyPrint(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            filename: "uncaughtExceptions.log",
        })
    );

    // // this works only for synchronous code
    // process.on("uncaughtException", (ex) => {
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    // process.on("unhandledRejection", (ex) => {
    //     console.log("WE GOT AN UNHANDLED REJECTION.");
    //     winston.error(ex.message, ex);
    //     // throw ex; //when using winston
    // });

    // handle internal server error. (like cannot connect to MongoDB. waits 30 seconds)
    winston.add(new winston.transports.File({ filename: "logfile.log" }));
    // winston.add(
    //     new winston.transports.MongoDB({
    //         db: "mongodb://localhost/vidly-database",
    //         level: "error",
    //     })
    // );
    winston.add(new winston.transports.Console());
};
