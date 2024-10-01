
const GenerateToken = require("../middlewares/generatetoken")
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const Users = require("../models/Users");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const sendVerificationEmail = require("../middlewares/sendVerificationEmail");
const secret = process.env.SECRET_KEY;

const crypto = require('crypto');
const auths  = require("../models/auth");
const { Op } = require("sequelize");

// router.post("/webhook", async (req, res) => {

//   const event = req.body;
//   const user = event.data;


//   if (event.type === "user.created") {
//     const userId = user.id;
//     const username = user.username;
//     console.log(user.username,"created sucessfully");
    
//     const email =
//       user.email_addresses && user.email_addresses.length > 0
//         ? user.email_addresses[0].email_address
//         : "No email provided";

//     try {
//       // Check if the user already exists by ID
//       const exist = await Users.findOne({
//         where: { username: username, id: userId },
//       });
//       console.log(
//         "User existence check result:",
//         exist ? "User exists" : "User does not exist"
//       );

//       if (exist) {
//         console.log(`User with ID ${userId} already exists.`);
//         return res.json({ message: "User already exists" });
        
//       }
//       else{
//       const passkey = generatePasskey(16);
//       const hashedPassword = await bcrypt.hash(passkey, 10);
//       await Users.create({
//         id: userId,
//         username: username,
//         email: email,
//         password:hashedPassword
//       });
//       console.log(passkey);

//       //sendEmail(passkey,email)
//         console.log(`User with ID ${userId} created successfully.`);
//         return res.status(201).json({ message: "User created" });
//       }
//     } catch (error) {
//       console.error(`Error creating user with ID ${userId}:`, error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   }

//   console.log(`Unhandled event type: ${event.type}`);
//   res.status(400).send("Unhandled event type");
// });



// Sign-up route





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
    const alreadyExists = await auths.findOne({ where: { email:email } });
    if (alreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

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
    
    if (!authUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    authUser.isVerified = true;
    authUser.verificationToken = undefined;
    authUser.verificationTokenExpires = undefined;
    console.log("authUser", authUser);
  
    
    await authUser.save();
    await Users.findOne({where:{email:emailAddress}});
    if(Users){
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

//  user login 
router.post('/login',async (req, res) => {
  const { emailOrUsername, password } = req.body;

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

// user forgot password


module.exports = router;
