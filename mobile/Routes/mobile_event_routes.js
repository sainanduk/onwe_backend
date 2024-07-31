const express = require('express');
const router = express.Router();
const Event = require('../../models/Event');
// Get all events
router.get('/mobile/events', async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: ["id",'title', 'media','dateOfEvent','description','time',"subtitle","category"]
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/mobile/events/:id', async (req, res) => {
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


module.exports = router;
