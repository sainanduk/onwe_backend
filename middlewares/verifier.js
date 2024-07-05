const { clerkClient } = require("../Config/client");
const verifier = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const session = await clerkClient.verifyToken(token);
    if (session) {
      req.session=session
      next();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

module.exports = verifier;