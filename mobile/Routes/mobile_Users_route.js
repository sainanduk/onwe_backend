const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Clubs = require('../models/Clubs'); 
const { Op } = require('sequelize');
const Posts = require('../models/Posts')
const PostLikes =require('../models/postLikes')
const userfollowers = require('../models/userfollowers')
const userfollowing = require('../models/userfollowing')
const createMulterUpload = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');
const verifier = require('../middlewares/verifier');
const uploadimages = createMulterUpload();


router.post('/mobile/user/info', verifier, async (req, res) => {
  const id = req.session.sub;
  console.log("working");

  try {
      
      const userPromise = Users.findByPk(id, {
          attributes: ['username', 'avatar', 'email', 'fullname', 'bio']
      });

      const postsPromise = Posts.findAll({
          where: { userid: id, clubid: null },
          include: [
              {
                  model: Users,
                  as: 'user',
                  attributes: ['avatar', 'username']
              },
              {
                  model: PostLikes,
                  as: 'postLikes',
                  where: { userId: id },
                  required: false
              }
          ],
          order: [['createdAt', 'DESC']]
      });

      
      const followersCountPromise = userfollowers.count({
          where: { userId: id }
      });

      
      const followingCountPromise = userfollowing.count({
          where: { userId: id }
      });

      
      const [user, posts, followersCount, followingCount] = await Promise.all([
          userPromise,
          postsPromise,
          followersCountPromise,
          followingCountPromise
      ]);

      
      const postsWithLikes = posts.map(post => ({
          id: post.id,
          title: post.title,
          description: post.description,
          userid: post.userid,
          avatar: post.user.avatar,
          username: post.user ? post.user.username : null, 
          likes: post.likes,
          tags: post.tags,
          media: post.media,
          category: post.category,
          liked: post.postLikes.length > 0 
      }));

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      
      const response = {
          user: user.toJSON(),
          posts:postsWithLikes,
          followersCount,
          followingCount
      };

      res.status(200).json(response);

  } catch (error) {
      console.error('Error fetching user information:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


router.patch('/mobile/user/edit',verifier,uploadimages,processimages, async (req, res) => {
    const userId  = req.session.sub;
    const { fullname, bio, socials, department, password } = req.body;
    console.log("work");
  
    try {
     
      let user = await Users.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.fullname = fullname || user.fullname;
      user.bio = bio || user.bio;
      user.socials = socials || user.socials;
      user.department = department || user.department;
      user.updatedAt = new Date();
      if (req.mediaData && req.mediaData.length > 0) {
        if (req.mediaData.length >= 1) {
          user.avatar = req.mediaData[0].base64String; 
        }
        if (req.mediaData.length >= 2) {
          user.coverimg = req.mediaData[1].base64String; 
        }
      }
  
      await user.save();

  
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
});


module.exports = router;
