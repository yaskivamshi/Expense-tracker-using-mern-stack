const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../services/emailService");

// ✅ Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ 
      msg: "User registered successfully", 
      token,
      user: { id: user._id, name: user.name, email: user.email } 
    });

  } catch (err) {
    console.error("❌ Register Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    console.log("🔹 Stored Hashed Password:", user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      msg: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // ✅ Send Email with Reset Link
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    await sendEmail(email, "Password Reset Request", `Click here to reset your password: ${resetUrl}`);

    res.json({ msg: "Password reset link sent. Check your email.", resetToken });

  } catch (err) {
    console.error("❌ Forgot Password Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Reset Password (Fixed)
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    console.log("🔹 Old Hashed Password:", user.password);

    // ✅ Set new password directly, UserSchema will handle hashing
    user.password = newPassword; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: "Password reset successful. Please login with your new password." });

  } catch (err) {
    console.error("❌ Reset Password Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Verify Password
exports.verifyPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    console.log("🔹 Stored Hashed Password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json({ msg: "Password is correct!" });
    } else {
      return res.status(400).json({ msg: "Incorrect password!" });
    }

  } catch (err) {
    console.error("❌ Verify Password Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};


