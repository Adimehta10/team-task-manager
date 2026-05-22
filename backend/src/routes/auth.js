const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();


// GENERATE JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// ==============================
// LOGIN
// ==============================
router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // CHECK VERIFIED
    if (!user.isVerified) {
      return res.status(401).json({
        message: 'Please verify your email first',
      });
    }

    const isMatch =
      await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// ==============================
// GET CURRENT USER
// ==============================
router.get('/me', protect, async (req, res) => {

  res.json(req.user);

});


// ==============================
// SEND OTP
// ==============================
router.post('/send-otp', async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    console.log('EMAIL RECEIVED:', email);

    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    // CHECK EXISTING VERIFIED USER
    const existingVerifiedUser =
      await User.findOne({
        email,
        isVerified: true,
      });

    if (existingVerifiedUser) {
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    let user = await User.findOne({
      email,
    });

    // CREATE TEMP USER
    if (!user) {

      user = new User({
        name,
        email,
        password,
        isVerified: false,
      });

    } else {

      // UPDATE EXISTING TEMP USER
      user.name = name;
      user.password = password;
    }

    user.otp = otp;

    user.otpExpiry =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    // SEND EMAIL
    await sendEmail(
      email,
      'OTP Verification',
      `Your OTP is ${otp}`
    );

    console.log('OTP SENT TO:', email);
    console.log('OTP IS:', otp);

    res.json({
      success: true,
      message: 'OTP sent successfully',
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


// ==============================
// VERIFY OTP
// ==============================
router.post('/verify-otp', async (req, res) => {

  try {

    const { email, otp } = req.body;

    console.log('VERIFY EMAIL:', email);
    console.log('VERIFY OTP:', otp);

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (
      user.otp !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    // VERIFY USER
    user.isVerified = true;

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // AUTO LOGIN TOKEN
    res.json({
      success: true,
      message: 'OTP verified successfully',

      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


module.exports = router;