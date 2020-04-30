const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
    it("should return a valid JWT", () => {
        const payload = {
            // toHexString is because the id is stored as an array of numbers. When auth token is generated it gives back string representation.
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true,
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        expect(decoded).toMatchObject(payload);
    });
});
