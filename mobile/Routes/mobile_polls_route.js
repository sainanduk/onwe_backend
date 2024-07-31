const express = require('express');
const router = express.Router();
const  Polls  = require('../../models/Polls');
const PollOptions = require('../../models/PollOptions')

// Create a new poll
router.post('/mobile/polls', async (req, res) => {
  const { clubId, question, options, createdBy } = req.body;
  if (!clubId || !question || !options || !createdBy) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const poll = await Polls.create({
      clubId,
      question,
      createdBy,
    });

    const pollOptions = options.map(option => ({
      pollId: poll.id,
      optionText: option,
    }));estiolkCreate(pollOptions);

    res.status(201).send({ pollId: poll.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get poll details
router.get('/mobile/polls/:id', async (req, res) => {
  const pollId = req.params.id;

  try {
    const poll = await Polls.findByPk(pollId, {
      include: PollOptions,
    });

    if (!poll) {
      return res.status(404).send('Poll not found');
    }

    res.send(poll);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Vote for a poll option
router.post('/mobile/polls/:id/vote', async (req, res) => {
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