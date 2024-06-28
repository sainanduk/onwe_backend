const Admins = require('../models/Admins'); // Assuming you have an Admins model

const isAdmin = async (req, res, next) => {
  const { userId } = req.body; // Adjust this to where you get your userId from, e.g., from req.user if using a JWT

  const admin = await Admins.findByPk(userId);
  if (!admin) {
    return res.status(403).json({ message: 'Forbidden: Only admins can perform this action' });
  }
  next();
};

module.exports = isAdmin;
