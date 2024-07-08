const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { clerkClient } = require("../Config/client");
const router = express.Router();
const secret = process.env.SECRET_KEY;

// Sign-up route
router.post('/Adminsignup', async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;

    // Check if the user already exists
    const existingUser = await Admins.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const existingEmail = await Admins.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password and create the user
    const hash = await bcrypt.hash(password, 10);
    await Admins.create({
      username,
      password: hash,
      email,
      fullname: fullName,
    });

    res.json('SUCCESS');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/Adminsignin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Admins.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: true }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ message: 'Authenticated successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post("/api/webhook", async (req, res) => {
  const event = req.body;
  const user = event.data;

  if (event.type === "user.created") {
    const userId = user.id;
    const username = user.username;
    const email =
      user.email_addresses && user.email_addresses.length > 0
        ? user.email_addresses[0].email_address
        : "No email provided";

    try {
      // Check if the user already exists by ID
      const exist = await Users.findOne({ where: { id: userId } });
      if (exist) {
        // console.log(`User with ID ${userId} already exists.`);
        // return res.status(200).json({ message: "User already exists" });
        return
      }

      // Create a new user
      await Users.create({
        id: userId,
        username: username,
        email: email,
      });

      console.log(`User with ID ${userId} created successfully.`);
      return res.status(201).json({ message: "User created" });
    } catch (error) {
      console.error(`Error creating user with ID ${userId}:`, error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // console.log(`Unhandled event type: ${event.type}`);
  res.status(400).send("Unhandled event type");
});

module.exports = router;