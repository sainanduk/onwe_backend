const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Users = require('../models/Users');
const Posts =require('../models/Posts')
const {sequelize} = require('../Config/database')
const userfollowers =require('../models/userfollowers')
const userfollowing =require('../models/userfollowing')

// Route to search users by username
router.get('/users/search', async (req, res) => {
  const { username } = req.body;

  try {
    const users = await Users.findAll({
      where: {
        username: {
          [Op.iLike]: `${username}%`
        }
      },
      attributes: ['id', 'username','avatar'] 
    });

    res.json(users);
  } catch (error) {
    console.error('Error searching users by username:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch user details
    const userPromise = Users.findByPk(id, {
      attributes: ['id', 'username', 'avatar']
    });

    // Fetch user's posts
    const postsPromise = Posts.findAll({
      where: { userid: id },
      attributes: ['id', 'title', 'description', 'likes', 'media', 'createdAt', 'updatedAt']
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

module.exports = router;
