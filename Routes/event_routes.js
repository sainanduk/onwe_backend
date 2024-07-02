const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const Event = require('../models/Event');
const isAdmin = require('../middlewares/adminCheck'); // Admin check middleware

const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});

// Helper function to upload a file to Google Cloud Storage
const uploadImageToGCS = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }

    const newFileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => reject(error));

    blobStream.on('finish', () => {
      fileUpload.makePublic().then(() => {
        resolve(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
      });
    });

    blobStream.end(file.buffer);
  });
};

// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll();
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
router.post('/events', isAdmin, upload.single('coverImage'), async (req, res) => {
  const { title, subtitle, dateOfEvent, description, category } = req.body;

  try {
    let coverImageUrl = '';
    if (req.file) {
      coverImageUrl = await uploadImageToGCS(req.file);
    }

    const newEvent = await Event.create({
      title,
      subtitle,
      dateOfEvent,
      description,
      category,
      coverImage: coverImageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// Update an event (admin only)
router.put('/events/:id', isAdmin, upload.single('coverImage'), async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, dateOfEvent, description, category } = req.body;

  try {// Define associations (ensure models are imported correctly)
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    let coverImageUrl = event.coverImage;
    if (req.file) {
      coverImageUrl = await uploadImageToGCS(req.file);
    }

    await event.up({// Define associations (ensure models are imported correctly)date({
      title,
      subtitle,
      dateOfEvent,
      description,
      category,
      coverImage: coverImageUrl,
      updatedAt: new Date(),
    });

    res.json({ message: 'Event updated successfully', event });
  }catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Delete an event (admin only)
router.delete('/events/:id', isAdmin, async (req, res) => {
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
