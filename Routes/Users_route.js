const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Clubs = require('../models/Clubs'); 
const { Op } = require('sequelize');
const Posts = require('../models/Posts')
const PostLikes =require('../models/postLikes')
const userfollowers = require('../models/userfollowers')
const createMulterUpload = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');
const verifier = require('../middlewares/verifier');
const uploadimages = createMulterUpload();


router.post('/user/info', verifier, async (req, res) => {
  const id = req.session.sub;
    console.log("this is user info checking requests");
    
  try {
   
      const user = await Users.findByPk(id, {
          attributes: ['username', 'avatar', 'email', 'fullname', 'bio', 'links']
      });

      const posts = await Posts.findAll({
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
          posts:postsWithLikes
      };

      res.status(200).json(response);

  } catch (error) {
      console.error('Error fetching user information:', error);
      res.status(500).json({ message: 'Server error' });
  }
});
router.get('/user/:username',verifier, async (req, res) => {
  const {username}=req.params
  console.log("this is user name info checking requests");

  try {
      
    const user = await Users.findOne({where:{username:username}});
    if(!user){ return res.status(404).json({ message: 'User not found' });}
    const posts = await Posts.findAll({
        where: { userid: user.id, clubid: null },
        include: [
            {
                model: Users,
                as: 'user',
                attributes: ['avatar', 'username']
            },
            {
                model: PostLikes,
                as: 'postLikes',
                where: { userId: user.id },
                required: false
            }
        ],
        order: [['createdAt', 'DESC']]
    });

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
        posts:postsWithLikes
    };
    // console.log("hi this nandu");
    
    res.status(200).json(response);

} catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ message: 'Server error' });
}
});

router.patch('/user/edit',verifier,uploadimages,processimages, async (req, res) => {
    const userId  = req.session.sub;
    const {isavatar}=req.query
    const { fullname, bio, socials, department, password, links } = req.body;
    console.log("work");
    console.log(isavatar);
    
    try {
     
      let user = await Users.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.fullname = fullname || user.fullname;
      user.bio = bio || user.bio;
      user.socials = socials || user.socials;
      user.department = department || user.department;
      user.links = Array.isArray(links) ? links : user.links;
      user.updatedAt = new Date();
      console.log(isavatar);

      if(req.mediaData.length==0 && !isavatar){
        user.avatar=""
      }
      else{

          if (req.mediaData && req.mediaData.length > 0) {
            if (req.mediaData.length >= 1) {
              user.avatar = req.mediaData[0].base64String; 
            }
            if (req.mediaData.length >= 2) {
              user.coverimg = req.mediaData[1].base64String; 
            }
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
