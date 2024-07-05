const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Users, Posts, userfollowers, userfollowing } = require('../models');

// Route to search users by username
router.get('/users/search', async (req, res) => {
  const { username } = req.query;

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
    const user = await Users.findByPk(id, {
      include: [
        {
          model: Posts,
          as: 'posts',
          attributes: ['id', 'title', 'createdAt'],
        },
        {
          model: userfollowers,
          as: 'followers',
          attributes: [[sequelize.fn('COUNT', sequelize.col('followers.followerId')), 'followersCount']],
        },
        {
          model: userfollowing,
          as: 'following', 
          attributes: [[sequelize.fn('COUNT', sequelize.col('following.followingId')), 'followingCount']],
        },
      ],
      attributes: ['id', 'username', 'avatar']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); 
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});


module.exports = router;
