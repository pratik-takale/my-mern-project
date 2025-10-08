const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", authMiddleware, logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: "Authenticated", user: req.user });
});

module.exports = router;
