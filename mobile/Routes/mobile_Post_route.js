const express = require('express');
const router = express.Router();
const Posts = require('../../models/Posts');
const PostLikes =require('../../models/postLikes')
const createMulterUpload = require('../../middlewares/uploadimages');
const processimages = require('../../middlewares/processimages');
const Comments = require('../../models/Comments');
const Users = require('../../models/Users');
const mobileVerifier = require('../middleware/mobileverifier')
const uploadimages = createMulterUpload();
// Route to get all posts
router.get('/mobile/posts', mobileVerifier, async (req, res) => {
  const token = req.session.token;
  const userId = req.session.userid;
  console.log(token);
  console.log(userId);
  
  
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 7; // Default to 7 posts if not provided
  const offset = (page - 1) * limit;

  try {
    let posts = await Posts.findAll({
      where: { clubid: null },
      limit: limit,
      offset: offset,
      include: [
        {
          model: Users,
          as: 'user',
          attributes: ['avatar', 'username']
        },
        {
          model: PostLikes,
          as: 'postLikes',
          where: { userId: userId },
          required: false 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Map posts to transform Sequelize objects into plain JSON
    const postsWithLikes = posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      userid: post.userid,
      avatar: post.user.avatar,
      username: post.user ? post.user.username : null, // Access the username from the included User model
      likes: post.likes,
      tags: post.tags,
      media: post.media,
      category: post.category,
      createdAt: post.createdAt,
      liked: post.postLikes.length > 0 // Check if there are likes for the user
    }));

    posts = postsWithLikes;

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

//getpost by category
router.get('/mobile/posts/category/:category',mobileVerifier, async (req, res) => {
  const { category } = req.params;
  const userId =req.session.sub;

  try {

    const posts = await Posts.findAll({
      where: { category:category,clubid: null },
      include: [
        {
          model: Users,
          as: 'user',
          attributes: ['avatar', 'username']
        },
        {
          model: PostLikes,
          as: 'postLikes',
          where: { userId: userId },
          required: false 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Map posts to transform Sequelize objects into plain JSON
    const postsWithLikes = posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      userid: post.userid,
      avatar:post.user.avatar,
      username: post.user ? post.user.username : null, // Access the username from the included User model
      likes: post.likes,
      tags: post.tags,
      media: post.media,
      category: post.category,
      liked: post.postLikes.length > 0 // Check if there are likes for the user
    }));

    res.json(postsWithLikes);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

  // post by id

  router.get('/mobile/posts/:postId', async (req, res) => {
    const { postId } = req.params;
    const userId =req.session.sub
  
    try {

      const posts = await Posts.findAll({
        where: { id:postId,clubid: null },
        include: [
          {
            model: Users,
            as: 'user',
            attributes: ['avatar', 'username']
          },
          {
            model: PostLikes,
            as: 'postLikes',
            where: { userId: userId },
            required: false 
          }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      // Map posts to transform Sequelize objects into plain JSON
      const postsWithLikes = posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        userid: post.userid,
        avatar:post.user.avatar,
        username: post.user ? post.user.username : null, // Access the username from the included User model
        likes: post.likes,
        tags: post.tags,
        media: post.media,
        category: post.category,
        liked: post.postLikes.length > 0 // Check if there are likes for the user
      }));
  
      res.json(postsWithLikes);
    }  catch (error) {
      console.error('Error fetching post by ID:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });

  //by user id to show user posts to user
  router.get('/mobile/user/:userId/posts', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const posts = await Posts.findAll({
        where: { authorId: userId }
      });
  
      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user' });
      }
  
      res.json(posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ message: 'Failed to fetch user posts' });
    }
  });

  //create new post

  router.post('/mobile/posts',mobileVerifier,uploadimages, processimages, async (req, res) => {
    const { title, description,category, tags, clubid } = req.body;
    const userid = req.session.sub
  
    try {
      // Create new post
      const newPost = await Posts.create({
        title,
        description,
        likes: 0,
        userid,
        media: req.mediaData.map(img => img.base64String),
        category,
        tags,
        clubid,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Failed to create post' });
    }
  }); 

  //delete post 

  router.delete('/mobile/posts/:postId', async (req, res) => {
    const { postId } = req.params;
  
    try {
      // Find the post by ID
      const post = await Posts.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Delete all comments associated with the postId
      await Comments.destroy({
        where: { postId: postId }
      });
  
      // Delete the post
      await post.destroy();
  
      // Respond with success message
      res.json({ message: 'Post and associated comments deleted successfully' });
    } catch (error) {
      console.error('Error deleting post and comments:', error);
      res.status(500).json({ message: 'Failed to delete post and comments' });
    }
  });
  
  router.patch('/mobile/posts/like',mobileVerifier, async (req, res) => {
    const userId  = req.session.sub;
    const {postId}  = req.body; 
    if(!postId || !userId){
      return res.json({message:"cannot like posts"})   
     }
    try {
      
      const existingLike = await PostLikes.findOne({
        where: {
          postId: postId,
          userId: userId
        }
      });
      if (existingLike) {
        await PostLikes.destroy({
          where: {
            postId: postId,
            userId: userId
          }
        });
        const post = await Posts.findByPk(postId);
        if (post) {
          await post.decrement('likes');
        }
  
        return res.json({ liked: false });
      } else {

        const pstlike=await PostLikes.create({
          postId: postId,
          userId: userId
        });
    
        const post = await Posts.findByPk(postId);
        if (post) {
          await post.increment('likes');
        }
  
        return res.json({ liked: true });
      }}
    catch (error) {
      console.error('Error updating likes:', error);
      res.status(500).json({ message: 'Failed to update likes' });
    }
  });
  
module.exports=router