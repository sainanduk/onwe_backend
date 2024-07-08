const express = require('express');
const router = express.Router();
const Posts = require('../models/Posts');
const PostLikes =require('../models/postlikes')
const createMulterUpload = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');
const Comments = require('../models/Comments');
const Users = require('../models/Users');
const uploadimages = createMulterUpload();
// Route to get all posts
router.get('/posts', async (req, res) => {
  const { userId } = req.body; // Assuming userId is obtained from authentication or session

  try {
    // Find all posts where clubid is null
    const posts = await Posts.findAll({
      where: { clubid: null },
      include: [
        {
          model: Users,
          attributes: ['avatar', 'username']
        },
        {
          model: PostLikes,
          as: 'postLikes', // Specify the alias used in the association
          where: { userId: userId },
          required: false // Use required: false to perform a LEFT OUTER JOIN
        }
      ]
    });

    // Map posts to transform Sequelize objects into plain JSON
    const postsWithLikes = posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      userid: post.userid,
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
//getpost by category
router.get('/posts/category/:category', async (req, res) => {
  const { category } = req.params;

  try {
    const posts = await Posts.findAll({
      where: { category }
    });
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found in this category' });
    }
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});
  // post by id

  router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
  
    try {
      const post = await Posts.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });
  //by userid to show user posts to user
  router.get('/user/:userId/posts', async (req, res) => {
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
 

  router.post('/posts', uploadimages, processimages, async (req, res) => {
    const { title, description,category, tags, clubid,userid } = req.body;
    //const userid = req.session.sub
  
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

  router.delete('/posts/:postId', async (req, res) => {
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
  

  router.patch('/posts/:postId/like', async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body; // Assuming userId is obtained from authentication or session
    //const userId =req.session.sub
    try {
      // Check if the user has already liked the post
      const existingLike = await PostLikes.findOne({
        where: {
          postId: postId,
          userId: userId
        }
      });
  
      if (existingLike) {
        // User already liked the post, so unlike it
        await PostLikes.destroy({
          where: {
            postId: postId,
            userId: userId
          }
        });
  
        // Decrement likes count in Posts table
        const post = await Posts.findByPk(postId);
        if (post) {
          await post.decrement('likes');
        }
  
        res.json({ liked: false });
      } else {
        // User has not liked the post, so like it
        await PostLikes.create({
          postId: postId,
          userId: userId
        });
  
        // Increment likes count in Posts table
        const post = await Posts.findByPk(postId);
        if (post) {
          await post.increment('likes');
        }
  
        res.json({ liked: true });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      res.status(500).json({ message: 'Failed to update likes' });
    }
  });
  
module.exports=router