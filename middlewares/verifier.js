
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
// const verifier = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const session = await clerkClient.verifyToken(token);
//     if (session) {
//       req.session=session
//       const user = await clerkClient.users.getUser(req.session.sub);
//       req.session = {
//         ...session,
//         userName: user.username, // Adjust based on the correct field from user object
//       };
      
//       next();
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(401).json({ message: "Unauthorized", error: error.message });
//   }
// };

const verifier = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) return res.status(401).json({ message: "Unauthorized" });
    jwt.verify(token, JWT_SECRET,(err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.session={sub:user.id,userName:user.username,EmailAddress:user.EmailAddress}
      next(); 
    });

}
catch (error) {
  res.status(401).json({ message: "Unauthorized", error: error.message });
}
}

module.exports = verifier;