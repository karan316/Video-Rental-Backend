const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 100,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
    },
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(100).required(),
        password: Joi.string().required().min(5).max(20),
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.userSchema = userSchema;
exports.validateUser = validateUser;
