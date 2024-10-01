const express = require('express');
const router = express.Router();
const { Op, where } = require('sequelize');
const Users = require('../models/Users');
const Posts =require('../models/Posts')
const {sequelize} = require('../Config/database')
const userfollowers =require('../models/userfollowers')
const Clubs =require('../models/Clubs')
const verifier =require('../middlewares/verifier');
const { post } = require('./Comments_route');
const ClubStatus = require('../models/clubstatuses');
// Route to search users by username
router.get('/explore/:tab/:search', verifier,async (req, res) => {
  const { tab, search } = req.params;
  const userid = req.session.sub; // Get userId from session or request

  try {
    if (tab === 'clubs') {
      // Fetch clubs based on the search term
      const clubs = await Clubs.findAll({
        where: {
          clubName: {
            [Op.iLike]: `${search}%`,
          },
        },
        attributes: ['clubId', 'clubName', 'coverImage'], // Include id to use for the second query
      });

      // Fetch club statuses for the user
      const userClubStatuses = await ClubStatus.findAll({
        where: { userId:userid },
        attributes: ['clubId'],
      });

      // Create a Set of clubIds where the user is a member
      const userClubIds = new Set(userClubStatuses.map(status => status.clubId));

      // Map clubs to include membership status
      const response = clubs.map(club => ({
        clubName: club.clubName,
        coverImage: club.coverImage,
        isUserMember: userClubIds.has(club.clubId),
      }));

      return res.status(200).json(response);
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

router.get('/search/username/:user', async (req, res) => {
  const {user } = req.params;
  try {

  
    const users = await Users.findAll({
      where: {
        username: {
          [Op.iLike]: `${user}`
        }
      },
      attributes: ['username'] 
    });
    if(users.length==0){
      return res.json(false)
    }
    return res.json(true);
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


router.get('/search/hashtagcount/:tag', async (req, res) => {
  const { tag } = req.params;
  const formattedTag = `#${tag}`; // Prefix with '#' to match hashtags

  try {
    // Retrieve all posts containing the hashtag pattern
    const posts = await Posts.findAll({
      attributes: ['tags'],
      where: {
        tags: {
          [Op.iLike]: `%${formattedTag}%` // Search for the tag within the tags string
        }
      }
    });

    // Extract hashtags and count occurrences that match the pattern
    const hashtagCounts = {};
    posts.forEach(post => {
      const tags = post.tags.match(/#[\w]+/g) || []; // Extract all hashtags
      tags.forEach(tag => {
        if (tag.toLowerCase().startsWith(formattedTag.toLowerCase())) { // Check for partial match
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        }
      });
    });

    // Convert counts to desired format
    const result = Object.entries(hashtagCounts).map(([tag, count]) => ({ tag, count }));

    return res.json(result); 
  } catch (error) {
    console.error('Error searching posts by hashtag:', error);
    res.status(500).json({ message: 'Failed to search posts by hashtag' });
  }
});
module.exports = router;
