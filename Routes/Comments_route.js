const express = require('express');
const router = express.Router();
const Comments = require('../models/Comments');
const { Op } = require('sequelize');
const Posts = require('../models/Posts')
const Users = require('../models/Users')
const verifier = require('../middlewares/verifier');

router.get('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    console.log("postId",postId)
  
    try {
      const comments = await Comments.findAll({
        where: {
          postId: postId,
          parentId: null
        },
        order: [['createdAt', 'desc']],
        include: [
          {
            model: Users,
            attributes: ['username', 'avatar']
          }
        ]
      });
      
  
      if (comments.length === 0) {
        return res.json([]);
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

// router.get('/subcomments', async (req, res) => {
//   const { postId, parentId } = req.body;

//   try {
//     // Fetch all comments with the given postId and parentId
//     const comments = await Comments.findAll({
//       where: {
//         postId: postId,
//         parentId: parentId
//       },
//       include:[
//         {
//           model: Users,
//           attributes: ['username', 'avatar']
//         }
//       ]
//     });

//     res.status(200).json(comments); // Respond with the fetched comments
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     res.status(500).json({ message: 'Failed to fetch comments' });
//   }
// });
router.get('/subcomments/:postId/:parentId', async (req, res) => {
  const { postId, parentId } = req.params;

  try {
    // Fetch all comments with the given postId and parentId
    const comments = await Comments.findAll({
      where: {
        postId: postId,
        parentId: parentId
      },
      order: [['createdAt', 'desc']],
      include: [
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
router.post('/comments', verifier ,async (req, res) => {
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
router.post('/comments/report', verifier, async (req, res) => {
  const { commentId } = req.body;
  const userId = req.session.sub;
  console.log("this is report comment");
  
  try {
    // Find the comment to report
    const comment = await Comments.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    console.log("this is report comment",comment.reportedBy);
    
    // Check if the user has already reported this comment
    if (comment.reportedBy && comment.reportedBy.includes(userId)) {
      console.log("this is report reported comment");
      
      return res.status(202).json({ message: 'You have already reported this comment' });
    }
    console.log("this is report reported comment log");
    
    // Increment the report counter
    comment.reportCount = (comment.reportCount || 0) + 1;

    // Add the user to the reportedBy array
    comment.reportedBy = comment.reportedBy ? [...comment.reportedBy, userId] : [userId];

    // Check if the report count exceeds the threshold
    if (comment.reportCount > 15) {
      await comment.destroy();
      return res.status(200).json({ message: 'Comment deleted due to excessive reports' });
    }
    console.log("this is report comment save");
    
    // Save the updated comment
    await comment.save();

    res.status(200).json({ message: 'Comment reported successfully', reportCount: comment.reportCount });
  } catch (error) {
    console.error('Error reporting comment:', error);
    res.status(500).json({ message: 'Failed to report comment' });
  }
});
router.delete('/comments/:commentId', verifier,async (req, res) => {
  const { commentId } = req.params;
  const userid =req.session.sub
  console.log("userid",userid);
  console.log("commentId",commentId);
  
  
  try {
    // Find the comment to delete
    const comment = await Comments.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if(comment.userId ===userid){

    // Delete the main comment
    await comment.destroy();

    // Delete all subcomments where parentId matches commentId
    await Comments.destroy({
      where: {
        parentId: commentId
      }
    });

    res.status(204).json({ message: 'Comment and subcomments deleted' });
  }
  else{
    return res.status(404).json({message:"you dont have access to delete the comment"})
  }
  } catch (error) {
    console.error('Error deleting comment and subcomments:', error);
    res.status(500).json({ message: 'Failed to delete comment and subcomments' });
  }
});

router.delete('/user/post/:postId/:commentId', async (req, res) => {
  try {
    const userId = req.session.sub
    const { postId, commentId } = req.params

    const userPost = await Posts.findOne({
      where: {
        id: postId,
        userId: userId
      }
    })

    if (userPost) {
      const comment = await Comments.findByPk(commentId);

      if (comment) {
       
        await comment.destroy()
        await Comments.destroy({
          where: {
            parentId: commentId
          }
        });

        return res.status(200).json({ message: "Comment deleted successfully" });
      } else {
        return res.status(404).json({ message: "Comment not found" });
      }
    } else {
      return res.status(403).json({ message: "You do not have permission to delete this comment" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while deleting the comment" });
  }
});


// Route to report a comment

module.exports = router;
