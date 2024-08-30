const express = require('express');
const router = express.Router();
const Artical = require('../models/Artical');
const createMulterUpload = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');
const uploadimages = createMulterUpload(); // Initialize multer middleware
const verifier = require('../middlewares/verifier');


router.get('/artical',verifier,async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 7; // Default to 7 posts if not provided
  const offset = (page - 1) * limit;
  try {
    const Artical = await Artical.findAll({
      order:[['updatedAt','DESC']]
    });
    res.status(200).json(Artical);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/artical',verifier,uploadimages,processimages,async(req,res)=>{
  if (!req.mediaData) {
    return res.status(400).json({ error: 'Media data is missing' });
  }
  try {
    const { owner, title, description } = req.body;

    const artical = await Artical.create({
      owner,
      title,
      description,
      likes:0,
      media:req.mediaData.map(img => img.base64String),
      isPublished:true,
      createdAt: new Date(),
    });

    res.status(201).json(artical);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
module.exports = router;
