const express = require('express');
const router = express.Router();
const Artical = require('../models/Artical');
const createMulterUpload = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');
const uploadimages = createMulterUpload(); // Initialize multer middleware
const verifier = require('../middlewares/verifier');
const Users = require('../models/Users');

const { includes } = require('../mobile/middleware/mobileverifier');
const { User } = require('@clerk/clerk-sdk-node');
const { Op } = require('sequelize');






router.get('/artical', async (req, res) => {
  try {
    // Step 1: Fetch articles
    let articles = await Artical.findAll({
      order: [['updatedAt', 'DESC']]
    });

    // Step 2: Extract unique usernames from articles
    const usernames = [...new Set(articles.map(article => article.owner))];

    // Step 3: Fetch user details based on usernames
    const users = await Users.findAll({
      where: {
        username: {
          [Op.in]: usernames
        }
      },
      attributes: ['username', 'avatar']
    });

    // Create a map for quick lookup
    const userMap = users.reduce((map, user) => {
      map[user.username] = user.avatar;
      return map;
    }, {});

    // Step 4: Add user details to each article
    articles = articles.map(article => ({
      ...article.toJSON(), 
      avatar: userMap[article.owner] 
    }));

    res.status(200).json(articles);
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

    const owner = req.session.userName;
    // Create the article
    const artical = await Artical.create({
      media: req.mediaData[1].base64String,
      owner,
      title,
      description,
      likes: 0,
      category,
      coverphoto: req.mediaData[0].base64String,
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
