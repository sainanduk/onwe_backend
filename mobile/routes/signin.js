const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const Users = require("../../models/Users");
const { clerkClient } = require("../../Config/client");
const router = express.Router();

router.post("/mobileLogin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    // Find the user by username
    const user = await Users.findOne({ where: { username: username } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verify the user's password
    const userId = user.id.toString(); // Ensure userId is a string
    const verify = await clerkClient.users.verifyPassword({
      userId: userId,
      password: password,
    });

    if (!verify) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const expiresIn = 4320000;
    // Create a sign-in token
    const response = await clerkClient.signInTokens.createSignInToken({
      userId: userId,
      expiresInSeconds: expiresIn,
    });
    // const data
    const finalData = {
      sessionId: response.id,
      userId: userId,
      token: response.token,
    };
    res.send(finalData);
  } catch (error) {
    console.error("Error during mobile login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
