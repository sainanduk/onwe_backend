const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Users = require('../models/Users');
const Posts =require('../models/Posts')
const {sequelize} = require('../Config/database')
const userfollowers =require('../models/userfollowers')
const Clubs =require('../models/Clubs')
const verifier =require('../middlewares/verifier')
// Route to search users by username
router.get('/explore/:tab/:search', async (req, res) => {
  const { tab,search } = req.params;
  try {
  if(tab==='clubs'){
    const clubs = await Clubs.findAll({
      where: {
        clubName: {
          [Op.iLike]: `${search}%`, 
        },
      },
      attributes:['clubName','coverImage']
    });

    return res.status(200).json(clubs);
  }
  else{
  
    const users = await Users.findAll({
      where: {
        username: {
          [Op.iLike]: `${search}%`
        }
      },
      attributes: ['id', 'username','avatar'] 
    });

    return res.json(users);
  }} catch (error) {
    console.error('Error searching users by username:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});



router.get('/search/:user', async (req, res) => {
  const {user } = req.params;
  try {

  
    const users = await Users.findAll({
      where: {
        username: {
          [Op.iLike]: `${user}%`
        }
      },
      attributes: ['id', 'username','avatar'] 
    });

    return res.json(users);
  } catch (error) {
    console.error('Error searching users by username:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});


router.get('/search/:Hashtag', async (req, res) => {
  const {Hashtag } = req.params;
  try {

  
    const users = await Posts.findAll({
      where: {
        tags: {
          [Op.iLike]: `${Hashtag}%`
        }
      },
      attributes: ['id', 'username','avatar'] 
    });

    return res.json(users);
  } catch (error) {
    console.error('Error searching users by username:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

module.exports = router;
