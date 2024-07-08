const express = require('express');
const router = express.Router();
const Magazines = require('../models/Magazines');
const isAdmin = require('../middlewares/adminCheck')

// Post magazine route
router.post('/magazines', isAdmin, uploadimages, processimages, async (req, res) => {
  try {
    const { owner, title, description, likes, isPublished } = req.body;

    const newMagazine = await Magazines.create({
      media:req.imageData.map(img => img.base64String),
      owner,
      title,
      description,
      likes,
      isPublished,
      createdAt: new Date(),
    });

    res.status(201).json(newMagazine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get magazines route
router.get('/magazines', async (req, res) => {
  try {
    const magazines = await Magazines.findAll();
    res.status(200).json(magazines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
