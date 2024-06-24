const express = require('express');
const router = express.Router();
const Clubs = require('../models/Clubs');
const User = require('../models/users');
const { Op } = require('sequelize');

// Route to get clubs by IDs from the User model's clubs array
router.post('/clubs/by-user', async (req, res) => {
  const { userId } = req.body;
  try {
    //Fetch user by ID to get club IDs from the clubs array
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const clubIds = user.clubs || [];

    const clubs = await Clubs.findAll({
      where: {
        id: {
          [Op.in]: clubIds
        }
      }
    });
    res.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs by user\'s club IDs:', error);
    res.status(500).json({ message: 'Failed to fetch clubs' });
  }
});

// Route to get club details by ID
router.get('/clubs/:clubId', async (req, res) => {
    const { clubId } = req.params;
  
    try {
      const club = await Clubs.findByPk(clubId);
  
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
  
      res.json(club);
    } catch (error) {
      console.error('Error fetching club by ID:', error);
      res.status(500).json({ message: 'Failed to fetch club' });
    }
  });

  module.exports = router;
  