const express = require('express');
const router = express.Router();
const Artical = require('../models/Artical');
const createMulterUpload = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');
const uploadimages = createMulterUpload(); // Initialize multer middleware
const verifier = require('../middlewares/verifier');
const Users = require('../models/Users');






router.get('/artical',verifier,async (req, res) => {
  // const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  // const limit = parseInt(req.query.limit) || 7; // Default to 7 posts if not provided
  // const offset = (page - 1) * limit;
  try {
    const Arti = await Artical.findAll({
      order:[['updatedAt','DESC']]
    });
    res.status(200).json(Arti);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/artical/:category',verifier,async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 7; // Default to 7 posts if not provided
  const offset = (page - 1) * limit;
  try {
    const Arti = await Artical.findAll({
      where:{
        category:category
      },
      limit:limit,
      offset:offset,
      order:[['createdAt','DESC']]
    });
    res.status(200).json(Arti);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//working
router.post('/artical', verifier, uploadimages, processimages, async (req, res) => {
  if (!req.mediaData) {
    return res.status(400).json({ error: 'Media data is missing' });
  }

  try {
    const { title, description, category } = req.body;
    const userid = req.session.sub;

    if (!userid) {
      return res.status(400).json({ error: 'User ID is missing from session' });
    }

    // Find the user
    const user = await Users.findOne({
      where: { id: userid },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const owner = user.username;

    // Create the article
    const artical = await Artical.create({
      owner,
      title,
      description,
      category,
      likes: 0,
      coverphoto: req.mediaData[0],
      media: req.mediaData[1],
      isPublished: true,
      createdAt: new Date(),
    });

    res.status(201).json(artical);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
