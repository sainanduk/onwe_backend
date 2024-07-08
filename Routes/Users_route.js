const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Clubs = require('../models/Clubs'); // Assuming you have a Clubs model
const { Op } = require('sequelize');
const createMulterUpload = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');
const uploadimages = createMulterUpload();

// Route to create a new user
router.patch('/users/:id',uploadimages,processimages, async (req, res) => {
    const { id } = req.params;
    const { fullname, bio, socials, department, password } = req.body;
  
    try {
      // Find the user by ID
      let user = await Users.findByPk(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user fields
      user.fullname = fullname || user.fullname;
      user.bio = bio || user.bio;
      user.socials = socials || user.socials;
      user.department = department || user.department;
      user.password = password || user.password;
      user.updatedAt = new Date();
  
      if (mediaData && mediaData.length > 0) {
        if (mediaData.length >= 1) {
          user.avatar = req.mediaData[0].base64String; 
        }
        if (mediaData.length >= 2) {
          user.coverimg = req.mediaData[1].base64String; 
        }
      }
      await user.save();
  
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  });

module.exports = router;
