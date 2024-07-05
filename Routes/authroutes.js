const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { clerkClient } = require("../Config/client");
const router = express.Router();
const secret = process.env.SECRET_KEY;
router.post("/signup", async (req, res) => {
  try {
    const { username, password, email, fullName, department } = req.body;

    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        password: hash,
        email: email,
        fullname: fullName,
        department: department,
      });
      res.json("SUCCESS");
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
        console.log(`User with ID ${userId} already exists.`);
        return res.status(200).json({ message: "User already exists" });
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