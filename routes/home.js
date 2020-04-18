const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { title: "Vidly App", message: "Backend API" });
});

module.exports = router;
