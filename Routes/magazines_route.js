const express = require('express');
const router = express.Router();
const Magazines = require('../models/Magazines');
const createMulterUpload = require('../middlewares/uploadimages');
const redisClient = require('../Redis/redis');
// Get magazines route
router.get('/magazines', async (req, res) => {
  try {
    // Check if the magazines data is in Redis cache
    const cachedMagazines = await redisClient.get('magazines');

    if (cachedMagazines) {
      // If found, return the cached data
      console.log('Magazines found in cache');
      
      return res.status(200).json(JSON.parse(cachedMagazines));
    }

    // If not found in cache, fetch from database
    console.log('Magazines not found in cache');
    
    const magazines = await Magazines.findAll({
      order: [['updatedAt', 'DESC']],
    });

    // Store the data in Redis cache
    await redisClient.set('magazines', JSON.stringify(magazines), {
      EX: 7200, // Cache expiration time set to 2 hours (7200 seconds)
    });

    res.status(200).json(magazines);
  } catch (error) {
    console.error('Error fetching magazines:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
