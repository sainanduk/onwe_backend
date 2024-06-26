const express = require('express');
const router = express.Router();
const Posts = require('../models/Posts'); // Adjust this line if your structure is different
const Users = require('../models/Users');

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Posts.findAll();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Get posts by category
router.get('/posts/category/:category', async (req, res) => {
  const { category } = req.params;

  try {
    const posts = await Posts.findAll({ where: { category } });
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found in this category' });
    }
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Get post by ID
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

// Get posts by user ID
router.get('/user/:userId/posts', async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Posts.findAll({ where: { authorId: userId } });
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user' });
    }
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Failed to fetch user posts' });
  }
});

// Create new post
router.post('/posts', async (req, res) => {
  const { title, description, authorId, media, category, tags } = req.body;

  try {
    const newPost = await 
      Posts.create({
        title,
        description,
        likes: 0,
        authorId,
        media,
        category,
        tags,
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
  });
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Delete post
router.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Posts.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.destroy();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

module.exports = router;
