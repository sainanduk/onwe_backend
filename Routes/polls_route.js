const express = require('express');
const router = express.Router();
const  Polls  = require('../models/Polls');
const PollOptions = require('../models/PollOptions');
const verifier = require('../middlewares/verifier');
const Votes = require('../models/Votes');
const Users =require('../models/Users')
const { json } = require('body-parser');
// Create a new poll
router.post('/polls', verifier,async (req, res) => {
  const { question, options } = req.body;
  const createdBy=req.session.sub;
  // Check for required fields
  if (!question || !options || !createdBy) {
    return res.status(400).send('Missing required fields');
  }

  try {  
    // Create the poll
    const poll = await Polls.create({
      question,
      createdBy,
    });
    
    

    // Create poll options
    const pollOptions = options.map(option => ({
      pollId: poll.id,
      optionText: option,
    }));
    console.log("hello");
    // Save poll options to the database
    await PollOptions.bulkCreate(pollOptions);  
    console.log("hiii");
    // Send the response
    res.status(201).send({ pollId: poll.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Get all polls with pagination, options, and check if the user has voted
router.get('/polls', verifier, async (req, res) => {
  const userId = req.session.sub; // Get userId from session
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 7; // Default to 7 polls if not provided
  const offset = (page - 1) * limit;

  try {
    const polls = await Polls.findAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: PollOptions,
          as: 'PollOptions',  // Must match the alias defined in the association
          attributes: ['id', 'optionText', 'votes'],
          include: [
            {
              model: Votes,
              as: 'Votes', // Must match the alias defined in the association
              where: { userId: userId },
              required: false
            }
          ]
        },
        {
          model: Users, 
          as: 'User', 
          attributes: ['username', 'avatar'], // Fetch only username and avatar
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    
    const pollsWithVotes = polls.map(poll => {
      
      const userVoteOptions = poll.PollOptions.flatMap(option => 
        option.Votes.filter(vote => vote.userId === userId)
      );

      return {
        id: poll.id,
        question: poll.question,
        createdBy:  poll.User?.username || 'Unknown',
        avatar: poll.User?.avatar || null,
        PollOptions: poll.PollOptions.map(option => ({
          id: option.id,
          optionText: option.optionText,
          votes: option.votes,
          userHasVoted: userVoteOptions.some(vote => vote.pollOptionId === option.id)
        })),
        userHasVoted: userVoteOptions.length > 0
      };
    });

    res.status(200).json(
     pollsWithVotes
    );
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch polls' });
  }
});

router.get('/polls/:username', verifier, async (req, res) => {
  console.log("polls by username", req.params.username);
  
  const user = await Users.findOne({where:{username:req.params.username}});
  console.log("user",user);
  
  if (!user) {
    return res.status(400).send('User not found');
  }
  const userId = user.id;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 7; // Default to 7 polls if not provided
  const offset = (page - 1) * limit;
  try {
    const polls = await Polls.findAll({
      where:{createdBy:userId},
      limit: limit,
      offset: offset,
      include: [
        {
          model: PollOptions,
          as: 'PollOptions',  // Must match the alias defined in the association
          attributes: ['id', 'optionText', 'votes'],
          include: [
            {
              model: Votes,
              as: 'Votes', // Must match the alias defined in the association
              where: { userId: userId },
              required: false
            }
          ]
        },
        {
          model: Users, // Include the Users model to fetch user details
          as: 'User', // Must match the alias in the Polls-Users association
          attributes: ['username', 'avatar'], // Fetch only username and avatar
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Map polls to transform Sequelize objects into plain JSON and check user votes
    const pollsWithVotes = polls.map(poll => {
      // Flatten PollOptions and check if the user has voted on any option
      const userVoteOptions = poll.PollOptions.flatMap(option => 
        option.Votes.filter(vote => vote.userId === userId)
      );

      return {
        id: poll.id,
        question: poll.question,
        createdBy:  poll.User?.username || 'Unknown',
        avatar: poll.User?.avatar || null,
        PollOptions: poll.PollOptions.map(option => ({
          id: option.id,
          optionText: option.optionText,
          votes: option.votes,
          userHasVoted: userVoteOptions.some(vote => vote.pollOptionId === option.id)
        })),
        userHasVoted: userVoteOptions.length > 0
      };
    });

    res.status(200).json(
     pollsWithVotes
    );
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch polls' });
  }
});



router.post('/polls/:id/vote', async (req, res) => {
  const pollId = req.params.id;
  const { optionId } = req.body;
  const userId = req.session.sub; // Get userId from session (or request, depending on your setup)

  if (!optionId) {
    return res.status(400).send('Missing required fields');
  }

  try {
    // Check if the poll option exists
    const pollOption = await PollOptions.findOne({
      where: { id: optionId, pollId },
    });

    if (!pollOption) {
      return res.status(404).send('Option not found');
    }

    // Check if the user has already voted for this option
    const existingVote = await Votes.findOne({
      where: { pollOptionId: optionId, userId },
    });

    if (existingVote) {
      return res.status(400).send('User has already voted for this option');
    }

    // Increment the votes count
    pollOption.votes += 1;
    await pollOption.save();

    // Record the user's vote
    await Votes.create({
      pollOptionId: optionId,
      userId,
    });
console.log("VOTED");

    const poll = await Polls.findOne({
      where:{id:pollId},
      include: [
        {
          model: PollOptions,
          as: 'PollOptions',  // Must match the alias defined in the association
          attributes: ['id', 'optionText', 'votes'],
          include: [
            {
              model: Votes,
              as: 'Votes', // Must match the alias defined in the association
              where: { userId: userId },
              required: false
            }
          ]
        },
        {
          model: Users, // Include the Users model to fetch user details
          as: 'User', // Must match the alias in the Polls-Users association
          attributes: ['username', 'avatar'], // Fetch only username and avatar
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    console.log("FOUND POLL");
    
    // Map polls to transform Sequelize objects into plain JSON and check user votes
    
    
    const pollsWithVotes = {
      id: poll.id,
      question: poll.question,
      createdBy: poll.User?.username || 'Unknown',
      avatar: poll.User?.avatar || null,
      PollOptions: poll.PollOptions.map(option => ({
        id: option.id,
        optionText: option.optionText,
        votes: option.votes,
      })),
    };
    
    res.status(201).send(pollsWithVotes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//give polls to user which are created by user
router.get('/mypolls', verifier, async (req, res) => {
  const userId = req.session.sub; // Get userId from session

  try {
    const polls = await Polls.findAll({
      where:{createdBy:userId},
      include: [
        {
          model: PollOptions,
          as: 'PollOptions',  // Must match the alias defined in the association
          attributes: ['id', 'optionText', 'votes'],
          include: [
            {
              model: Votes,
              as: 'Votes', // Must match the alias defined in the association
              where: { userId: userId },
              required: false
            }
          ]
        },
        {
          model: Users, // Include the Users model to fetch user details
          as: 'User', // Must match the alias in the Polls-Users association
          attributes: ['username', 'avatar'], // Fetch only username and avatar
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Map polls to transform Sequelize objects into plain JSON and check user votes
    const pollsWithVotes = polls.map(poll => {
      // Flatten PollOptions and check if the user has voted on any option
      const userVoteOptions = poll.PollOptions.flatMap(option => 
        option.Votes.filter(vote => vote.userId === userId)
      );

      return {
        id: poll.id,
        question: poll.question,
        createdBy:  poll.User?.username || 'Unknown',
        avatar: poll.User?.avatar || null,
        PollOptions: poll.PollOptions.map(option => ({
          id: option.id,
          optionText: option.optionText,
          votes: option.votes,
          userHasVoted: userVoteOptions.some(vote => vote.pollOptionId === option.id)
        })),
        userHasVoted: userVoteOptions.length > 0
      };
    });

    res.status(200).json(
     pollsWithVotes
    );
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch polls' });
  }
});

// Delete a poll
router.delete('/polls/:id', verifier, async (req, res) => {
  console.log("delete poll",req.params.id);
  
  const pollId = req.params.id;
  const userId = req.session.sub; 

  try {
    const poll = await Polls.findOne({ where: { id: pollId } });

    const pollOptions = await PollOptions.findAll({ where: { pollId } });

    const votes = await Votes.findAll({
      where: { pollOptionId: pollOptions.map(option => option.id) }
    });

    // Check if the poll exists
    if (!poll) {
      return res.status(404).send('Poll not found');
    }
    pollOptions.forEach(async option => await option.destroy());
    votes.forEach(async vote => await vote.destroy());
    await poll.destroy();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
);





module.exports = router;