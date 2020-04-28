const config = require("config");
module.exports = function () {
    // check if the jwtPrivateKey is defined
    if (!config.get("jwtPrivateKey")) {
        // throw an error winston will catch it.
        throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
    }
};
