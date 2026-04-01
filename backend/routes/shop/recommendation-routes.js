const express = require("express");
const router = express.Router();
const { getUserRecommendations } = require("../../controllers/shop/recommendation-controller");
const auth = require("../../middleware/auth");

router.get("/", auth, getUserRecommendations);

module.exports = router;