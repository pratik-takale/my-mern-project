// middleware/auth.js
module.exports = (req, res, next) => {
  const user = req.user || { id: "testUserId" }; // temp
  req.user = user;
  next();
};