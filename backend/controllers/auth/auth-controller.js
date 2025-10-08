const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Register user
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, userName: user.userName, role: user.role },
      process.env.CLIENT_SECRET_KEY || "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "Logged in successfully",
      user: { id: user._id, userName: user.userName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout user
const logoutUser = (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out successfully" });
};

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY || "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
