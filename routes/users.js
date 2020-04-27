const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const auth = require("../middleware/auth");

// route to get the user's profile
router.get("/me", auth, async (req, res) => {
    // req is set to the user's jwt in the auth middleware from where we can get his id from the payload. Exclude the password when sending to the client.
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // if the user already exists in the database
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    // another way of creating a new user object. just pick the values from req.body.
    user = new User(_.pick(req.body, ["name", "email", "password"]));
    // hash the passwords
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = user.generateAuthToken();

    // we don't want to send the password to the client as response. so we use lodash to pick the properties that we want from the object.(we could also send user.name, user.email instead of using lodash but this is how it is normally done)
    // send the token as a header to log the user in after registering
    res.header("x-auth-token", token).send(
        _.pick(user, ["_id", "name", "email"])
    );
});

module.exports = router;
