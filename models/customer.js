const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    phone: {
        type: String,
        required: true,
    },
    isGold: {
        type: Boolean,
        default: false,
    },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        phone: Joi.string().length(10).required(),
        isGold: Joi.boolean(),
    };

    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
