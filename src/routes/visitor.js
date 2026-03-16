// routes/visitorRoutes.js
const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");

// Route to get total visitors
router.get("/count", visitorController.getTotalVisitors);

// Route to get visitors by country
router.get("/by-country", visitorController.getVisitorsByCountry);
router.post("/log", visitorController.trackVisitor);

module.exports = router;
