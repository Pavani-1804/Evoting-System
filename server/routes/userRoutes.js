const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();

console.log("🔥 User routes loaded");

// ====================== REGISTER ======================
router.post("/register", async (req, res) => {
  try {
    console.log("📝 Register request body:", req.body);

    const { name, email, password, role, adminCode, photo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Please provide name, email and password" 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role
    let finalRole = "voter";
    if (role === "admin") {
      if (adminCode !== "ADMIN123") {
        return res.status(400).json({ message: "Invalid Admin Access Code" });
      }
      finalRole = "admin";
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      photo: photo || "",
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Helper to send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Votexa Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Votexa E-Voting Security Code",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 25px; border-radius: 15px; border: 1px solid #00f5d4; max-width: 450px; margin: auto;">
            <h2 style="color: #00f5d4; text-align: center; font-size: 28px; margin-bottom: 20px;">Votexa E-Voting</h2>
            <p style="font-size: 14px; color: #ccc;">A login attempt was requested for your account. Please use the verification code below to authorize your session.</p>
            <div style="background-color: #111; border: 1px solid rgba(0, 245, 212, 0.3); border-radius: 10px; padding: 15px; text-align: center; margin: 25px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #00f5d4; font-family: monospace;">${otp}</span>
            </div>
            <p style="font-size: 11px; color: #555; text-align: center;">This code is valid for 5 minutes. If you did not request this, please secure your credentials immediately.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 OTP successfully emailed to ${email}`);
    } else {
      console.log(`ℹ️ SMTP credentials missing from .env. Skipping real email delivery.`);
    }
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
  }
};

// ====================== LOGIN (STEP 1: CREDENTIALS CHECK & SEND OTP) ======================
router.post("/login", async (req, res) => {
  try {
    console.log("📝 Login request step 1:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    user.otp = otpCode;
    user.otpExpires = otpExpires;
    await user.save();

    console.log(`\n======================================================`);
    console.log(`🔑 [SECURITY AUDIT] OTP generated for ${email}: ${otpCode}`);
    console.log(`======================================================\n`);

    // Dispatch email (runs asynchronously in the background)
    sendOTPEmail(email, otpCode);

    res.json({
      otpSent: true,
      message: "Security code sent to your email"
    });

  } catch (error) {
    console.error("Login Step 1 Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ====================== VERIFY OTP & COMPLETE LOGIN (STEP 2) ======================
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("📝 Verify OTP request body:", req.body);
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Please provide email and verification code" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Allow "999999" as a debug bypass code for final project demo convenience
    const isBypass = otp === "999999";
    const isValidOTP = user.otp === otp && new Date() < user.otpExpires;

    if (!isBypass && !isValidOTP) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Clear OTP fields upon success
    user.otp = "";
    user.otpExpires = undefined;
    await user.save();

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "voter",
        photo: user.photo || ""
      }
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ====================== GET PROFILE ======================
const auth = require("../middleware/auth");
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ====================== GET ALL USERS (ADMIN) ======================
const adminCheck = require("../middleware/admin");
router.get("/all", auth, adminCheck, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ====================== RESET ELECTION (ADMIN) ======================
router.post("/reset-election", auth, adminCheck, async (req, res) => {
  try {
    // Reset voting status for all users
    await User.updateMany({}, { hasVoted: false });
    
    // Reset votes count for all candidates
    const Candidate = require("../models/Candidate");
    await Candidate.updateMany({}, { votes: 0 });

    res.json({ message: "Election reset successfully" });
  } catch (error) {
    console.error("Reset Election Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;