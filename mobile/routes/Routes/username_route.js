const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Users = require('../models/Users');

// Route to search users by username
router.post('/users/username', async (req, res) => {
    const { username } = req.body;
  
    try {
      const user = await Users.findOne({
        where: { username }
      });
  
      if (user) {
        res.status(200).json({ message: "Username not available" });
      } else {
        res.status(200).json({ message: "Username available" });
      }
    } catch (error) {
      console.error('Error searching users by username:', error);
      res.status(500).json({ message: 'Failed to search users' });
    }
  });
module.exports=router