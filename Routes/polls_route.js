const express = require('express');
const router = express.Router();
const  Polls  = require('../models/Polls');
const PollOptions = require('../models/PollOptions');
const verifier = require('../middlewares/verifier');
const Votes = require('../models/Votes');
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
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Map polls to transform Sequelize objects into plain JSON
    const pollsWithVotes = polls.map(poll => {
      const userVoteOptions = poll.PollOptions.flatMap(option => 
        option.Votes.filter(vote => vote.userId === userId)
      );

      return {
        id: poll.id,
        question: poll.question,
        createdBy: poll.createdBy,
        PollOptions: poll.PollOptions.map(option => ({
          id: option.id,
          optionText: option.optionText,
          votes: option.votes,
          userHasVoted: userVoteOptions.some(vote => vote.pollOptionId === option.id)
        })),
        userHasVoted: userVoteOptions.length > 0
      };
    });

    res.json(pollsWithVotes);
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ message: 'Failed to fetch polls' });
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

    res.send('Vote counted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;