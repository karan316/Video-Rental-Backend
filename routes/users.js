const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");

router.get("/", async (req, res) => {
    const users = await User.find().sort("name");
    res.send(users);
});

router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).send("User with the given id not found");
        return;
    }
    res.send(user);
});

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    await user.save();
    res.send(user);
});

router.put("/:id", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        },
        { new: true }
    );

    if (!user) {
        res.status(404).send("User with given id not found");
        return;
    }
    res.send(user);
});

router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) {
        res.status(404).send("User with the given id not found");
        return;
    }
    res.send(user);
});

module.exports = router;
