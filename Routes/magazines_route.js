const express = require('express');
const router = express.Router();
const Magazines = require('../models/Magazines');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Post magazine route
router.post('/magazines', upload.single('imageFile'), async (req, res) => {
  try {
    const { owner, title, description, likes, isPublished } = req.body;
    const imageFile = req.file.buffer;

    const newMagazine = await Magazines.create({
      imageFile,
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
