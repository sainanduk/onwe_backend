const express = require('express');
const router = express.Router();
const Comments = require('../models/Comments');
const { Op } = require('sequelize');


// Route to get all comments for a specific post by postId
router.get('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
  
    try {
      const comments = await Comments.findAll({
        where: { postId }
      });
  
      if (comments.length === 0) {
        return res.status(404).json({ message: 'No comments found for this post' });
      }
  
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments by post ID:', error);
      res.status(500).json({ message: 'Failed to fetch comments' });
    }
  });

// Route to get a specific comment by ID
router.get('/comments/:commentId', async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comments.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    console.error('Error fetching comment by ID:', error);
    res.status(500).json({ message: 'Failed to fetch comment' });
  }
});

// Route to get all comments for a specific post
router.get('/posts/:postId/all-comments', async (req, res) => {
    const { postId } = req.params;
  
    try {
      const post = await Posts.findByPk(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const commentIds = post.comments || [];
  
      const comments = await Comments.findAll({
        where: {
          id: commentIds
        }
      });
  
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments for post:', error);
      res.status(500).json({ message: 'Failed to fetch comments for post' });
    }
  });

//subcomments
  // Route to get specific comments based on comment IDs
router.get('/specific-comments', async (req, res) => {
    const { commentIds } = req.query; // Assuming commentIds are passed as query parameters
  
    if (!commentIds || !Array.isArray(commentIds)) {
      return res.status(400).json({ message: 'Invalid comment IDs provided' });
    }
  
    try {
      const comments = await Comments.findAll({
        where: {
          id: {
            [Op.in]: commentIds
          }
        }
      });
  
      if (!comments || comments.length === 0) {
        return res.status(404).json({ message: 'No comments found' });
      }
  
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments by IDs:', error);
      res.status(500).json({ message: 'Failed to fetch comments' });
    }
  });

//comments to subcomments

router.post('/comments/:parentId', async (req, res) => {
    const { parentId } = req.params;
    const { content } = req.body;
  
    try {
      //new comment
      const newComment = await Comments.create({
        content,
        createdAt: new Date()
      });
  
      //parent comment by its ID
      const parentComment = await Comments.findByPk(parentId);
  
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
  
      // Update the parent comment's comments array with the new comment's ID
      const updatedParentComment = await parentComment.update({
        comments: [...parentComment.comments, newComment.id]
      });
  
      res.status(201).json(newComment); // Respond with the newly created comment
    } catch (error) {
      console.error('Error creating comment and updating parent comment:', error);
      res.status(500).json({ message: 'Failed to create comment and update parent comment' });
    }
  });

  
// Route to create a new comment and update the post's comments array
router.post('/comments', async (req, res) => {
  const { postId, userId, content, replies } = req.body;

  try {
    // Create the new comment
    const newComment = await Comments.create({
      postId,
      userId,
      content,
      replies,
      createdAt: new Date()
    });
    console.log("hello");
    // Fetch the related post

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
});

// Route to delete a comment by ID
router.delete('/comments/:commentId', async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comments.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();
    res.status(204).json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});



module.exports = router;
