const express = require("express");
const router = express.Router();
const Clubs = require("../models/Clubs");
const User = require("../models/Users");
const { Op } = require("sequelize");
const Posts = require("../models/Posts");
const createMulterUpload = require("../middlewares/uploadimages");
const processimages = require("../middlewares/processimages");
const isAdmin = require("../middlewares/adminCheck");
const uploadImages = createMulterUpload();
const ClubStatuses = require("../models/ClubStatuses");

// create a club
router.post("/clubs/create", uploadImages, processimages, async (req, res) => {
  const { clubName, slogan } = req.body;
  try {
    // Check if a club with the same name already exists
    const existingClub = await Clubs.findOne({
      where: {
        clubName: {
          [Op.iLike]: clubName,
        },
      },
    });

    if (existingClub) {
      return res
        .status(400)
        .json({ message: "Club with the same name already exists" });
    }

    // Create a new club
    const newClub = await Clubs.create({
      clubName,
      slogan,
      coverImage: req.mediaData.map((img) => img.base64String),
      members: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res
      .status(201)
      .json({ message: "Club created successfully", club: newClub });
  } catch (error) {
    console.error("Error creating club:", error);
    res.status(500).json({ message: "Failed to create club" });
  }
});

//search clubs by names
router.get("/clubs/search", async (req, res) => {
  const { name } = req.body;

  try {
    // Perform a case-insensitive search for clubs whose name contains the provided query string
    const clubs = await Clubs.findAll({
      where: {
        clubName: {
          [Op.iLike]: `%${name}%`, // Case-insensitive search for name containing the query string
        },
      },
    });

    res.status(200).json(clubs);
  } catch (error) {
    console.error("Error searching clubs by name:", error);
    res.status(500).json({ message: "Failed to search clubs by name" });
  }
});

// Route to make an announcement
router.post(
  "/clubs/announcement",
  uploadImages,
  processimages,
  async (req, res) => {
    const { userId, clubId, message, title, tags } = req.body;

    try {
      const club = await Clubs.findByPk(clubId);

      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }

      // Create a new post for the announcement
      const newPost = await Posts.create({
        title: title,
        description: message,
        likes: 0,
        userid: userId,
        media: req.mediaData.map((img) => img.base64String),
        category: "announcement",
        tags: tags,
        clubid: clubId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res
        .status(201)
        .json({ message: "Announcement made successfully", post: newPost });
    } catch (error) {
      console.error("Error making announcement:", error);
      res.status(500).json({ message: "Failed to make announcement" });
    }
  }
);

// Route to get all announcements for a specific club
router.get("/clubs/:clubId/announcements", async (req, res) => {
  const { clubId } = req.params;

  try {
    const announcements = await Posts.findAll({
      where: {
        clubid: clubId,
        category: "announcement",
      },
    });

    if (announcements.length === 0) {
      return res
        .status(404)
        .json({ message: "No announcements found for this club" });
    }

    res.status(200).json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
});

router.post("/clubs/join", async (req, res) => {
  const { userId, clubId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const club = await Clubs.findByPk(clubId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if the user is already a member of the club
    const existingMembership = await ClubStatuses.findOne({
      where: {
        userId: userId,
        clubId: clubId,
        leftAt: null, // User is still a member if leftAt is null
      },
    });

    if (existingMembership) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Add the user to the club's members
    await ClubStatuses.create({
      userId: userId,
      clubId: clubId,
      isAdmin: false, // Default to not admin
      joinedAt: new Date(),
    });

    // Increment club's member count
    club.members += 1;
    await club.save();

    res.status(200).json({ message: "User joined the club successfully" });
  } catch (error) {
    console.error("Error joining club:", error);
    res.status(500).json({ message: "Failed to join club" });
  }
});

router.post("/clubs/exit", async (req, res) => {
  const { userId, clubId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const club = await Clubs.findByPk(clubId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Find the user's membership record
    const membership = await ClubStatuses.findOne({
      where: {
        userId: userId,
        clubId: clubId,
        leftAt: null, // User is still a member if leftAt is null
      },
    });

    if (!membership) {
      return res
        .status(400)
        .json({ message: "User is not a member of the club" });
    }

    // Destroy the membership record
    await membership.destroy();

    // Decrement club's member count
    club.members -= 1;
    await club.save();

    res.status(200).json({ message: "User exited the club successfully" });
  } catch (error) {
    console.error("Error exiting club:", error);
    res.status(500).json({ message: "Failed to exit club" });
  }
});

router.post("/clubs/admin", async (req, res) => {
  const { userId, clubId, toBeAdminUsername } = req.body;

  try {
    const user = await User.findByPk(userId);
    const club = await Clubs.findByPk(clubId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Find the user's membership record
    const membership = await ClubStatuses.findOne({
      where: {
        userId: userId,
        clubId: clubId,
        isAdmin: true, // User is still a member if leftAt is null
      },
    });

    if (!membership) {
      return res
        .status(400)
        .json({ message: "User is not a admin of the club" });
    }
    const toBeAdmin = await User.findOne({
      where: {
        username: toBeAdminUsername,
      },
    });
    if (!toBeAdmin) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the user's status to admin
    const isUserPresent = await ClubStatuses.findOne({
      where: {
        userId: toBeAdmin.id,
        clubId: clubId,
      },
    });
    if (!isUserPresent) {
      return res
        .status(400)
        .json({ message: "User is not a member of the club" });
    }
    isUserPresent.isAdmin = true;
    await membership.save();

    res.status(200).json({ message: "User is now an admin of the club" });
  } catch (error) {
    console.error("Error making user an admin:", error);
    res.status(500).json({ message: "Failed to make user an admin" });
  }
});

module.exports = router;
