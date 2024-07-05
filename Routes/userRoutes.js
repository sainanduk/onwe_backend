const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Clubs = require('../models/Clubs'); // Assuming you have a Clubs model
const { Op } = require('sequelize');

// Route to get clubs by IDs from the User model's clubs array
router.get('/users/:userId/clubs', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const clubIds = user.clubs;
    const clubs = await Clubs.findAll({
      where: {
        id: { [Op.in]: clubIds }
      }
    });

    res.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({ message: 'Failed to fetch clubs' });
  }
});
// Route to create a new user
router.post('/users', async (req, res) => {
    const { id, username, email, fullname, avatar, bio, post, clubs, socials, pears, department, role, coverimg, password, refreshToken } = req.body;
  
    try {
      const newUser = await Users.create({
        id,
        username,
        email,
        fullname,
        avatar,
        bio,
        post,
        clubs,
        socials,
        pears,
        department,
        role,
        coverimg,
        password,
        refreshToken,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

// Route to update user information
router.put('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const updatedData = req.body;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update(updatedData);
    res.json({ message: 'User information updated successfully', user });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ message: 'Failed to update user information' });
  }
});

module.exports = router;
