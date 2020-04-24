const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // if the user already exists in the database
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email and password.");

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    // if not a valid password
    if (!validPassword)
        return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    // valid password
    res.send(token);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(100).required().email(),
        password: Joi.string().required().min(5).max(255),
    };

    return Joi.validate(req, schema);
}

module.exports = router;
