const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const RemindEvent = require('../models/RemindEvents');
const redisClient = require('../Redis/redis');
// Get all events
router.get('/events', async (req, res) => {
  console.log("events route");
  
  try {
    // Check if the data is in Redis cache
    const cachedEvents = await redisClient.get('events');

    if (cachedEvents) {
      // If found, return the cached data
      const events = JSON.parse(cachedEvents);
      console.log("events found in cache");
      
      return res.json(events);
    }
    console.log("events not found in cache");
    

    // If not found in cache, fetch from database
    const events = await Event.findAll({
       // Filtering by clubId as per your requirement
      attributes: ["id", 'title', 'media', 'dateOfEvent', 'description', 'time', "link", "category"],
      order: [['dateOfEvent', 'ASC']],
    });

    // Store the data in Redis cache for 2 hours (7200 seconds)
    await redisClient.set('events', JSON.stringify(events), {
      EX: 7200, // Cache expiration time set to 2 hours
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

router.post('/events/remind', async (req, res) => {
  const { userEmail } = req.session.EmalAddress;
  const { eventId } = req.body;
  const {userId}=req.session.sub;
  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Add user to reminder list
    const existingReminder =await RemindEvent.findOne({ where: { eventId, userId } });
    if (existingReminder) {
      return res.status(400).json({ message: 'User already added to reminder list' });
    }
    await RemindEvent.create({ userId, userEmail,eventId, dateOfEvent: event.dateOfEvent });
    res.status(201).json({ message: 'User added to reminder list' });
  } catch (error) {
    console.error('Error adding user to reminder list:', error);
    res.status(500).json({ message: 'Failed to add user to reminder list' });
  }
})

module.exports = router;
