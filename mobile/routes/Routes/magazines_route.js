const express = require('express');
const router = express.Router();
const Magazines = require('../../../models/Magazines');
const createMulterUpload = require('../middlewares/uploadimages');

// Get magazines route
router.get('/magazines',async (req, res) => {
  try {
    const magazines = await Magazines.findAll({
      order:[['updatedAt','DESC']]
    });
    res.status(200).json(magazines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
