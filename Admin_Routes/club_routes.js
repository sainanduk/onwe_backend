const express = require("express");
const router = express.Router();
const Clubs = require("../models/Clubs");
const Users = require("../models/Users");
const { Op, where } = require("sequelize");
const Posts = require("../models/Posts");
const createMulterUpload = require("../middlewares/uploadimages");
const processimages = require("../middlewares/processimages");
const isAdmin = require("../middlewares/adminCheck");
const uploadImages = createMulterUpload();
const ClubStatuses = require("../models/clubstatuses");

const PostLikes = require('../models/postLikes');


  // create a club this is for admin
  router.post("/clubs/create", uploadImages, processimages, async (req, res) => {
    const { clubName, slogan } = req.body;
    try {
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
module.exports=router