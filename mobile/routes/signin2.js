const express = require("express");
const router = express.Router();
const {clerkClient} = require('../../Config/client')

// Define the mobile_login route
router.post("/mobile_login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Attempt to sign in the user
    const user = await clerkClient.users.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Authenticate user with Clerk
    const session = await clerkClient.sessions.createSession({
      emailAddress: email,
      password: password,
    });

    if (!session) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a sign-in token
    const token = await clerkClient.signInTokens.create({
      sessionId: session.id,
      template: "test", // Adjust the template if needed
    });

    res.json({ token });
  } catch (error) {
    console.error("Error during mobile login:", error.message || error);
    res.status(500).json({ message: "Internal Server Error", details: error.message || error });
  }
});

module.exports = router;
