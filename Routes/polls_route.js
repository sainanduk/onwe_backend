const express = require('express');
const router = express.Router();
const  Polls  = require('../models/Polls');
const PollOptions = require('../models/PollOptions');
const verifier = require('../middlewares/verifier');
const Votes = require('../models/Votes')
// Create a new poll
router.post('/polls',verifier, async (req, res) => {
  const { clubId, question, options } = req.body;
  const createdBy=req.session.sub
  // Check for required fields
  if (!question || !options || !createdBy) {
    return res.status(400).send('Missing required fields');
  }

  try {
    // Create the poll
    const poll = await Polls.create({
      clubId,
      question,
      createdBy,
    });

    // Create poll options
    const pollOptions = options.map(option => ({
      pollId: poll.id,
      optionText: option,
    }));

    // Save poll options to the database
    await PollOptions.bulkCreate(pollOptions);  

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
    let polls = await Polls.findAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: PollOptions,
          attributes: ['id', 'optionText', 'votes'],
        },
        {
          model: Votes,
          as: 'userVotes',
          where: { userId: userId },
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Map polls to transform Sequelize objects into plain JSON
    const pollsWithVotes = polls.map(poll => {
      const userVote = poll.userVotes.length > 0; // Check if user has voted

      return {
        id: poll.id,
        question: poll.question,
        createdBy: poll.createdBy,
        PollOptions: poll.PollOptions.map(option => ({
          id: option.id,
          optionText: option.optionText,
          votes: userVote ? option.votes : null, // Show votes only if user has voted
        })),
        userHasVoted: userVote // Flag to indicate if the user has voted
      };
    });

    res.json(pollsWithVotes);
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ message: 'Failed to fetch polls' });
  }
});


// Vote for a poll option
router.post('/polls/:id/vote', async (req, res) => {
  const pollId = req.params.id;
  const { optionId } = req.body;

  if (!optionId) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const pollOption = await PollOptions.findOne({
      where: { id: optionId, pollId },
    });

    if (!pollOption) {
      return res.status(404).send('Option not found');
    }

    pollOption.votes += 1;
    await pollOption.save();

    res.send('Vote counted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;