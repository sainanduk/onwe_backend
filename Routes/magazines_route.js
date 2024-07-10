const express = require('express');
const router = express.Router();
const Magazines = require('../models/Magazines');
const createMulterUpload = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');
const uploadimages = createMulterUpload(); // Initialize multer middleware
const verifier = require('../middlewares/verifier');
// Post magazine route
router.post('/magazines', uploadimages, processimages, async (req, res) => {

  if (!req.mediaData) {
    return res.status(400).json({ error: 'Media data is missing' });
  }
  try {
    const { owner, title, description, likes, isPublished } = req.body;

    const newMagazine = await Magazines.create({
      owner,
      title,
      description,
      likes,
      media:req.mediaData.map(img => img.base64String),
      isPublished,
      createdAt: new Date(),
    });

    res.status(201).json(newMagazine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get magazines route
router.get('/magazines', verifier,async (req, res) => {
  try {
    const magazines = await Magazines.findAll();
    res.status(200).json(magazines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
