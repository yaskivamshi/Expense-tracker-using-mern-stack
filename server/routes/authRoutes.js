
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, verifyPassword } = require("../controllers/authController.js");
/*const { forgotPassword } = require("../controllers/authController"); // Import forgotPassword function*/


// ✅ User Registration
router.post("/register", registerUser);

// ✅ User Login
router.post("/login", loginUser);

// ✅ Forgot Password
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password
router.post("/reset-password", resetPassword);

// ✅ Verify Password
router.post("/verify-password", verifyPassword);

// Forgot Password Route (POST)
/*router.post("/forgot-password", forgotPassword);*/

module.exports = router;

