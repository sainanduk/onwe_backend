const express = require('express');
const router = express.Router();
const Comments = require('../models/Comments');
const { Op } = require('sequelize');
const Posts = require('../models/Posts')
const Users = require('../models/Users')
// Route to get all comments for a specific post by postId
router.get('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
  
    try {
      const comments = await Comments.findAll({
        where: {
          postId: postId,
          parentId: null
        },
        include: [
          {
            model: Users,
            attributes: ['username', 'avatar']
          }
        ]
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

//fetch all subcomments

router.get('/subcomments', async (req, res) => {
  const { postId, parentId } = req.body;

  try {
    // Fetch all comments with the given postId and parentId
    const comments = await Comments.findAll({
      where: {
        postId: postId,
        parentId: parentId
      },
      include:[
        {
          model: Users,
          attributes: ['username', 'avatar']
        }
      ]
    });

    res.status(200).json(comments); // Respond with the fetched comments
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});


  
// Route to create a new comment and update the post's comments array
router.post('/comments', async (req, res) => {
  const { postId,  content,parentId} = req.body;
  const userId = req.session.sub

  try {
    // Create the new comment
    const newComment = await Comments.create({
      postId,
      userId,
      content,
      parentId,
      createdAt: new Date()
    });
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
    // Find the comment to delete
    const comment = await Comments.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Delete the main comment
    await comment.destroy();

    // Delete all subcomments where parentId matches commentId
    await Comments.destroy({
      where: {
        parentId: commentId
      }
    });

    res.status(204).json({ message: 'Comment and subcomments deleted' });
  } catch (error) {
    console.error('Error deleting comment and subcomments:', error);
    res.status(500).json({ message: 'Failed to delete comment and subcomments' });
  }
});



module.exports = router;
