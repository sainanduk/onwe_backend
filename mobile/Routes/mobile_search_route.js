const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Users = require('../../models/Users');
const Posts =require('../../models/Posts')
const {sequelize} = require('../../Config/database')
const userfollowers =require('../../models/userfollowers')
const Clubs =require('../../models/Clubs')
const mobileVerifier =require('../middleware/mobileverifier')
// Route to search users by username
router.get('/mobile/explore/:tab/:search', async (req, res) => {
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

// router.get('/users/info', verifier,async (req, res) => {
//   const id  = req.session.sub;
//   console.log("working");

//   try {
//     // Fetch user details
//     const userPromise = Users.findByPk(id, {
//       attributes: ['username', 'avatar']
//     });

//     // Fetch user's posts
//     const postsPromise = Posts.findAll({
//       where: { userid: id,clubid:null},
//       attributes: ['id', 'title', 'description', 'likes', 'media', 'createdAt']
//     });

//     // Fetch followers count
//     const followersCountPromise = userfollowers.count({
//       where: { userId: id }
//     });

//     // Fetch following count
//     const followingCountPromise = userfollowing.count({
//       where: { userId: id }
//     });

//     // Resolve promises concurrently
//     const [user, posts, followersCount, followingCount] = await Promise.all([
//       userPromise,
//       postsPromise,
//       followersCountPromise,
//       followingCountPromise
//     ]);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Construct response object
//     const response = {
//       user: user.toJSON(),
//       posts,
//       followersCount,
//       followingCount
//     };

//     res.json(response);
//   } catch (error) {
//     console.error('Error fetching user details, posts, followers, and following counts:', error);
//     res.status(500).json({ message: 'Failed to fetch user details, posts, followers, and following counts' });
//   }
// });

module.exports = router;
