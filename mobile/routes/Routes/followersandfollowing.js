const express = require('express');
const router = express.Router();
const UserFollowing = require('../models/userfollowing'); // Adjust the path as per your project structure

// Route to check if user is following another user
router.get('/check-follow', async (req, res) => {
  const { username, followUsername } = req.body;

  try {
    // Check if there is a record in UserFollowing for the given pair of usernames
    const isFollowing = await UserFollowing.findOne({
      where: {
        userId: username,
        followingId: followUsername
      }
    });

    if (isFollowing) {
      res.status(200).json({ following: true });
    } else {
      res.status(200).json({ following: false });
    }
  } catch (error) {
    console.error('Error checking if user is following:', error);
    res.status(500).json({ message: 'Failed to check if user is following' });
  }
});


router.post('/follow', async (req, res) => {
    const { username, followUsername } = req.body;
  
    try {
      // Check if the users exist and retrieve their IDs (assuming usernames are unique)
      const [followingUser, followerUser] = await Promise.all([
        UserFollowing.findOne({ where: { userId: username, followingId: followUsername } }),
        UserFollowers.findOne({ where: { userId: followUsername, followerId: username } }),
      ]);
  
      if (followingUser || followerUser) {
        return res.status(400).json({ message: 'Already following or follower' });
      }
  
      // Create new records in both UserFollowing and UserFollowers tables
      await Promise.all([
        UserFollowing.create({ userId: username, followingId: followUsername }),
        UserFollowers.create({ userId: followUsername, followerId: username }),
      ]);
  
      res.status(201).json({ message: 'Successfully followed' });
    } catch (error) {
      console.error('Error following user:', error);
      res.status(500).json({ message: 'Failed to follow user' });
    }
  });
router.post('/unfollow', async (req, res) => {
    const { username, unfollowUsername } = req.body;
  
    try {
      // Delete records from both UserFollowing and UserFollowers tables
      await Promise.all([
        UserFollowing.destroy({ where: { userId: username, followingId: unfollowUsername } }),
        UserFollowers.destroy({ where: { userId: unfollowUsername, followerId: username } }),
      ]);
  
      res.status(200).json({ message: 'Successfully unfollowed' });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      res.status(500).json({ message: 'Failed to unfollow user' });
    }
  });  


  // Route to get count of followers and following
// router.get('/followers-following-count/:username', async (req, res) => {
//   const { username } = req.params;

//   try {
//     // Count of users following the given username
//     const followersCount = await UserFollowers.count({ where: { userId: username } });

//     // Count of users whom the given username is following
//     const followingCount = await UserFollowing.count({ where: { userId: username } });

//     res.status(200).json({ followersCount, followingCount });
//   } catch (error) {
//     console.error('Error fetching followers and following count:', error);
//     res.status(500).json({ message: 'Failed to fetch followers and following count' });
//   }
// });

module.exports = router;
