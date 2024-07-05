const express = require('express');
const router = express.Router();
const Clubs = require('../models/Clubs');
const User = require('../models/Users');
const { Op } = require('sequelize');
const Posts = require('../models/Posts');
const uploadimages = require('../middlewares/uploadimages');
const processimages = require('../middlewares/processimages');

//search all clubs in which the user is there
router.post('/clubs/by-user', async (req, res) => {
  const { userId } = req.body;

  try {
    // Fetch user by ID to get club IDs from the clubs array
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let clubs;
    const clubIds = user.clubs || [];

    if (clubIds.length === 0) {
      // If clubs array is empty, fetch all clubs
      res.send(200).json({message:"No clubs found"})
    } else {
      // Fetch clubs where the club ID is in the user's clubs array
      clubs = await Clubs.findAll({
        where: {
          id: {
            [Op.in]: clubIds
          }
        }
      });
    }

    res.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs by user\'s club IDs:', error);
    res.status(500).json({ message: 'Failed to fetch clubs' });
  }
});

// Route to get club details and posts by clubidID
router.get('/clubs/:clubId', async (req, res) => {
  const { clubId } = req.params;

  try {
    const clubPromise = Clubs.findByPk(clubId);
    const clubPostsPromise = Posts.findAll({
      where: { clubid: clubId }
    });
    const [club, clubposts] = await Promise.all([clubPromise, clubPostsPromise]);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.status(200).json({ club, clubposts });
  } catch (error) {
    console.error('Error fetching club by ID:', error);
    res.status(500).json({ message: 'Failed to fetch club and its posts' });
  }
});


//search clubs by names
router.get('/clubs/search', async (req, res) => {
  const { name } = req.query;

  try {
    // Perform a case-insensitive search for clubs whose name contains the provided query string
    const clubs = await Clubs.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`  // Case-insensitive search for name containing the query string
        }
      }
    });

    res.status(200).json(clubs);
  } catch (error) {
    console.error('Error searching clubs by name:', error);
    res.status(500).json({ message: 'Failed to search clubs by name' });
  }
});

// Route to join a club and increment members count
router.post('/clubs/join', async (req, res) => {
  const { userId, clubId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const club = await Clubs.findByPk(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if user is already a member
    if (user.clubs && user.clubs.includes(clubId)) {
      return res.status(400).json({ message: 'User is already a member of the club' });
    }

    // Add clubId to user's clubs array and save
    user.clubs = user.clubs || [];
    user.clubs.push(clubId);

    // Increment club's members count
    club.members = (club.members || 0) + 1;

    // Save both user and club concurrently
    await Promise.all([
      user.save(),
      club.save()
    ]);

    res.status(200).json({ message: 'User joined the club successfully', user, club });
  } catch (error) {
    console.error('Error joining club:', error);
    res.status(500).json({ message: 'Failed to join club' });
  }
});



// Route to make an announcement
router.post('/clubs/announcement', isAdmin,uploadimages, processimages, async (req, res) => {
  const { userId, clubId, message,title,tags} = req.body;

  try {
    const club = await Clubs.findByPk(clubId);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Create a new post for the announcement
    const newPost = await Posts.create({
      title: title,
      description: message,
      likes: 0,
      userid: userId,
      media: req.mediaData,
      category: 'announcement',
      tags: tags,
      clubid: clubId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ message: 'Announcement made successfully', post: newPost });
  } catch (error) {
    console.error('Error making announcement:', error);
    res.status(500).json({ message: 'Failed to make announcement' });
  }
});

// Route to get all announcements for a specific club
router.get('/clubs/:clubId/announcements', async (req, res) => {
  const { clubId } = req.params;

  try {
    const announcements = await Posts.findAll({
      where: {
        clubid: clubId,
        category: 'announcement'
      }
    });

    if (announcements.length === 0) {
      return res.status(404).json({ message: 'No announcements found for this club' });
    }

    res.status(200).json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
});

// make a user as admin
router.post('/clubs/:clubId/make-admin', isAdmin, async (req, res) => {
  const { username } = req.body;
  const { club } = req;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already an admin
    if (club.admins.includes(user.id)) {
      return res.status(400).json({ message: 'User is already an admin of the club' });
    }

    // Add the user's ID to the club's admins array
    club.admins.push(user.id);

    // Save the updated club
    await club.save();

    res.status(200).json({ message: 'User has been made an admin', club });
  } catch (error) {
    console.error('Error making user an admin:', error);
    res.status(500).json({ message: 'Failed to make user an admin' });
  }
});
module.exports = router;
  
