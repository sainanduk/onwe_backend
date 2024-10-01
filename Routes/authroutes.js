
const GenerateToken = require("../middlewares/generatetoken")
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const Users = require("../models/Users");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {sendVerificationEmail, sendPasswordResetEmail, sendResetSuccessEmail} = require("../middlewares/sendVerificationEmail");
const secret = process.env.SECRET_KEY;

const crypto = require('crypto');
const auths  = require("../models/auth");
const { Op } = require("sequelize");
const auth = require("../models/auth");


router.post("/Adminsignup", async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;

    // Check if the user already exists
    const existingUser = await Admins.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const existingEmail = await Admins.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password and create the user
    const hash = await bcrypt.hash(password, 10);
    await Admins.create({
      username,
      password: hash,
      email,
      fullname: fullName,
    });

    res.status(200).json('SUCCESS');
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/Adminsignin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Admins.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: true },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Authenticated successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// user sign up
router.post('/signup' , async (req, res) => {
  const { name, email, password } = req.body;
  console.log("signup", req.body);
  
  try {
    if (!email || !password || !name) {
      throw new error("All fields are required");
    }
    const user = await Users.findOne({ where: { email: email } });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const alreadyExists = await auths.findOne({ where: { email:email } });
    if (alreadyExists) {
    if (alreadyExists.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    else{
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      alreadyExists.verificationToken = verificationToken;
      alreadyExists.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; 
      await alreadyExists.save();
      sendVerificationEmail(email, verificationToken);
      return res.status(200).json({
        success: true,
        message: "Verification code sent successfully",
      });
    }}
    const hashedPassword = await bcryptjs.hash(password, 12);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const authUser = await auths.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    await authUser.save();
    // generateTokenAndSetCookie(res, authUser.id);
    console.log("verificationToken", verificationToken);
    
    sendVerificationEmail(email, verificationToken);
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// user email verifier
router.post('/verifyEmail', async (req, res) => {
  const { code, emailAddress } = req.body;
  console.log("verifyEmail", req.body);
  
  try {
    const authUser = await auths.findOne({
      where:{email:emailAddress,
      verificationToken: code,
      verificationTokenExpires: {
        [Op.gt]: Date.now()
      }
    }});
    console.log("authUser", authUser);
    
    if (!authUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    authUser.isVerified = true;
    authUser.verificationToken = undefined;
    authUser.verificationTokenExpires = undefined;
    console.log("saved authUser");
    
  
    
    await authUser.save();
    const user =await Users.findOne({where:{email:emailAddress}});
    console.log("Users", user);
    
    if(user){
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    await Users.create({
      username:authUser.name,
      email:authUser.email,
      password: authUser.password,
      createdAt: Date.now()
    })
    console.log("user created");
    
    // await sendWelcomeEmail(authUser.email, authUser.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      status: "complete",
    });
  } catch (error) {
    console.log({ success: false, message: "error in verifyEmail ", error });
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// user forgot password
router.post('/forgotPassword', async (req, res) => {
  const { email } = req.body;
  console.log(email);
  
  try {
    const user = await auths.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate OTP for password reset
    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // OTP valid for 1 hour

    user.resetPasswordToken = resetOTP;
    user.resetPasswordExpires = resetTokenExpiresAt;
console.log(resetOTP);

    await user.save();

    // Send OTP instead of URL for resetting password
    await sendPasswordResetEmail(user.email, resetOTP);

    res.status(200).json({
      success: true,
      message: "OTP to reset your password has been sent to your email!",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/resetPassword', async (req, res) => {
  try {
    const { otp, password } = req.body; // OTP and new password from frontend

    if (!otp || !password) {
      return res.status(400).json({ success: false, message: "OTP and password are required" });
    }

    // Find user by OTP and ensure OTP is still valid (not expired)
    const authUser = await auths.findOne({
      where: {
        resetPasswordToken: otp,
        resetPasswordExpires: { [Op.gt]: Date.now() }, // OTP expiration check
      },
    });

    if (!authUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 12);
    authUser.password = hashedPassword;

    // Clear OTP and expiration after successful password reset
    authUser.resetPasswordToken = null;
    authUser.resetPasswordExpires = null;
    await authUser.save();

    // Update the password in the Users table if necessary
    await Users.update(
      { password: hashedPassword },
      { where: { email: authUser.email } }
    );

    console.log("Password reset successfully");

    // Send confirmation email
    sendResetSuccessEmail(authUser.email);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

//  user login 
router.post('/login',async (req, res) => {
  const { emailOrUsername, password } = req.body;
  console.log("login", req.body);
  
  try {
    if (!emailOrUsername || !password) {
      throw new Error("All fields are required");
    }
    const user = await Users.findOne({
      where: {
        [Op.or]: [
          { email: emailOrUsername },  
          { username: emailOrUsername }  
        ]
      }
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    
    
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    console.log("isPasswordCorrect", isPasswordCorrect);
    
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    
    
    const token = GenerateToken(user);
    
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: token,
      status: "complete",
      username: user.username,
      avatar: user.avatar,
    });
  } catch (error) {
    console.log({ success: false, message: "error in login ", error });
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
