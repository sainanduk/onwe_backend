const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Clubs = require('../models/Clubs'); // Assuming you have a Clubs model
const { Op } = require('sequelize');
const Posts = require('../models/Posts')
const userfollowers = require('../models/userfollowers')
const userfollowing = require('../models/userfollowing')
const createMulterUpload = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');
const verifier = require('../middlewares/verifier');
const uploadimages = createMulterUpload();

// Route to update user

router.post('/user/info', verifier,async (req, res) => {
    const id  = req.session.sub;
    console.log("working");
  
    try {
      // Fetch user details
      const userPromise = Users.findByPk(id, {
        attributes: ['username', 'avatar','email','fullname','bio']
      });

      const postsPromise = Posts.findAll({
        where: { userid: id,clubid:null},
        attributes: ['id', 'title', 'description', 'likes', 'media', 'createdAt']
      });
  
      // Fetch followers count
      const followersCountPromise = userfollowers.count({
        where: { userId: id }
      });
  
      // Fetch following count
      const followingCountPromise = userfollowing.count({
        where: { userId: id }
      });
  
      // Resolve promises concurrently
      const [user, posts, followersCount, followingCount] = await Promise.all([
        userPromise,
        postsPromise,
        followersCountPromise,
        followingCountPromise
      ]);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Construct response object
      const response = {
        user: user.toJSON(),
        posts,
        followersCount,
        followingCount
      };
  
      res.json(response);
    } catch (error) {
      console.error('Error fetching user details, posts, followers, and following counts:', error);
      res.status(500).json({ message: 'Failed to fetch user details, posts, followers, and following counts' });
    }
  });

router.patch('/user/edit',verifier,uploadimages,processimages, async (req, res) => {
    const userId  = req.session.sub;
    const { fullname, bio, socials, department, password } = req.body;
  
    try {
      // Find the user by ID
      let user = await Users.findByPk(userId);
  
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
      if (req.mediaData && req.mediaData.length > 0) {
        if (req.mediaData.length >= 1) {
          user.avatar = req.mediaData[0].base64String; 
        }
        if (req.mediaData.length >= 2) {
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
