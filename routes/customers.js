const express = require("express");
const router = express.Router();
const { Customer, validateCustomer } = require("../models/customer");
router.get("/", async (req, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        res.status(404).send("Customer with the given id not found");
        return;
    }

    res.send(customer);
});

router.post("/", async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.params.isGold,
    });

    customer = await customer.save();
    res.send(customer);
});

router.put("/:id", async (req, res) => {
    const { error } = validateCustomer(req.body);

    if (error) {
        res.status(400).send("Customer with the given id not found");
        return;
    }

    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold,
        },
        { new: true }
    );

    if (!customer) {
        res.status(404).send("Genre with the given id not found");
        return;
    }

    res.send(customer);
});

router.delete("/:id", async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) {
        res.status(404).send("Customer with the given id not found");
        return;
    }

    res.send(customer);
});

module.exports = router;
