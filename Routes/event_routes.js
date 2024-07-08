const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const isAdmin = require('../middlewares/adminCheck');
const createMulterUpload = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');
const verifier = require('../middlewares/verifier');
const uploadimages = createMulterUpload();

// Get all events
router.get('/events',verifier, async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: ['title', 'media','dateOfEvent']
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

// Create a new event (admin only)
router.post('/Admin/events', uploadimages, processimages, async (req, res) => {
  const { title, subtitle, dateOfEvent, description, category,time} = req.body;
  //const userid = req.session.sub

  try {
    // Create new post
    const newEvent = await Event.create({
      title,
      subtitle,
      dateOfEvent,
      description,
      category,
      time,
      media: req.mediaData.map(img => img.base64String),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ message: 'Event created successfully',event: newEvent});
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Update an event (admin only)
router.patch('Admin/events/:id',isAdmin, uploadimages, processimages, async (req, res) => {
  const { title, subtitle, dateOfEvent, description, category, time } = req.body;
  const eventId = req.params.id;

  try {
    // Find the event by ID
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update event details
    event.title = title || event.title;
    event.subtitle = subtitle || event.subtitle;
    event.dateOfEvent = dateOfEvent || event.dateOfEvent;
    event.description = description || event.description;
    event.category = category || event.category;
    event.time = time || event.time;

    // Update media if new files are uploaded
    if (req.mediaData && req.mediaData.length > 0) {
      event.media = req.mediaData.map(img => img.base64String);
    }

    // Save the updated event
    await event.save();

    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Delete an event (admin only)
router.delete('Admin/events/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

module.exports = router;
