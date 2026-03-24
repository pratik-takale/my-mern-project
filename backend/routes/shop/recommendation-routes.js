const express = require("express");
const router = express.Router();

const { getUserRecommendations } = require("../../controllers/shop/recommendation-controller");

// ✅ route
router.get("/recommendations", getUserRecommendations);

// ✅ export router
module.exports = router;