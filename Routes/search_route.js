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
        },
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


router.get('/search/hashtag/:tag', async (req, res) => {
  const { tag } = req.params;

  const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit, 10) || 16; // Default to 16 items per page if not provided

  const offset = (page - 1) * limit; // Calculate the offset for pagination
console.log("hi hashtag");

  try {
    const posts = await Posts.findAll({
      attributes: ['id', 'media', 'description', 'likes'], 
      where: {
        tags: {
          [Op.iLike]: `%${tag}%` 
        }
      },
      include: [
        {
          model: Users,
          as: 'user', 
          attributes: ['avatar', 'username'], 
        }
      ],
      limit:limit,
      offset:offset
    });

   
    const formattedPosts = posts.map(post => ({
      id: post.id,
      media: post.media,
      description: post.description,
      likes: post.likes,
      avatar: post.user ? post.user.avatar : null, 
      username: post.user ? post.user.username : null, 
    }));

    
    return res.json(formattedPosts); 
  } catch (error) {
    console.error('Error searching posts by hashtag:', error);
    res.status(500).json({ message: 'Failed to search posts by hashtag' });
  }
});
module.exports = router;
