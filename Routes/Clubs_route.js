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
  const verifier=require('../middlewares/verifier');
  const PostLikes = require('../models/postLikes');
const { all } = require("./Post_route");
const Event = require('../models/Event');

//create posts and announcements in club
router.post('/clubs/posts', uploadImages, processimages, async (req, res) => {
    const { title, description, category, tags, clubname } = req.body;
    
    
    const userid = req.session.sub;
    console.log("club posts route working");
    try {
      // Find club by name
      const club = await Clubs.findOne({ where: { clubName: clubname } });
      
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
  
      // Create new post
      const newPost = await Posts.create({
        title,
        description,
        likes: 0,
        userid,
        media: req.mediaData.map(img => img.base64String),
        category,
        tags,
        clubid: club.clubId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      
      console.log("posted sucess");
        
      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Failed to create post' });
    }
  });


  router.get('/myclubs', async (req, res) => {
    const userId = req.session.sub;

    try {
      const userClubs = await ClubStatuses.findAll({
        where: { userId: userId },
        include: [{
          model: Clubs, 
          as: 'club',    
          attributes: ['clubId', 'clubName', 'coverImage'] 
        }]
      });

      const response = userClubs.map(userClub => ({
        id: userClub.id,
        clubName: userClub.club.clubName,
        coverImage: userClub.club.coverImage,
        isAdmin: userClubs.isAdmin
      }));

      res.json(response);
    } catch (error) {
      console.error('Error fetching user clubs:', error);
      res.status(500).json({ error: 'An error occurred while fetching user clubs' });
    }
  });
router.get('/clubs/all', async (req, res) => {
  console.log("this is with all clubs");
  
  try {
    const allClubs = await Clubs.findAll({
      attributes: ['clubId', 'clubName', 'coverImage','slogan'],
      order: [['clubName', 'ASC']]
    });
//  allClubs
    res.json(allClubs);
  } catch (error) {
    console.error('Error fetching all clubs:', error);
    res.status(500).json({ error: 'An error occurred while fetching all clubs' });
  }
})


  router.get('/clubs/check/:clubname', async (req, res) => {
    const { clubname } = req.params; 
    const userId = req.session.sub;
    console.log("Today's route");
  
    try {
      // Fetch club information
      const clubInfo = await Clubs.findOne({
        where: {
          clubName: clubname
        }
      });
  
      if (!clubInfo) {
        return res.status(404).send("Club does not exist");
      }
  
      // Check if user is part of the club
      const clubStatsInfo = await ClubStatuses.findOne({
        where: {
          clubId: clubInfo.clubId,
          userId: userId
        }
      });
  
      if (!clubStatsInfo) {
        return res.status(403).send("You are not part of the club");
      }
  
      // All checks passed
      return res.status(200).send(clubStatsInfo.isAdmin);
  
    } catch (error) {
      console.error("Error in /clubs/check/:clubname:", error); // Log the error for debugging
      res.status(500).send("Internal Server Error"); // Return a 500 status for internal errors
    }
  });
  
  // general working done 
  router.get('/clubs/:clubName/general', async (req, res) => {  
    
    const { clubName } = req.params;
    console.log("this is with general");
    const clubInfo = await Clubs.findOne({ where: { clubName: clubName } });
    if(!clubInfo){
      return res.status(404).json({message:`No clubs exists with the name ${clubName}`})
    }
    const clubId = clubInfo.clubId;

    const userId = req.session.sub;
    try {
      // Fetch club information
      const clubInfo = await Clubs.findOne({
        where: { clubName: clubName }
      });
      

      if (!clubInfo) {
        return res.status(404).json({ message: "Club not found" });
      }
      
      const isUserPresent = await ClubStatuses.findOne({
        where: { userId: userId, clubId: clubId },
        attributes: ['clubId']
      });
     

      if (!isUserPresent) {
        return res.status(403).json({ message: "Please join this club to check announcements." });
      }
      

      // Fetch posts for the club
      const posts = await Posts.findAll({
        where: { clubid: clubId.toString(),
          category: 'general' // Filter posts by category

         },
        include: [
          {
            model: Users,
            as: 'user', 
            attributes: ['avatar', 'username']
          },
          {
            model: PostLikes,
            as: 'postLikes',
            where: { userId: userId },
            required: false
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      console.log("g log 6");
      console.log(req.session.userName);
      

      // Transform posts into plain JSON
      const postsWithLikes = posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        userId: post.userId,
        avatar: post.user.avatar,
        username: post.user.username,
        likes: post.postLikes.length,
        tags: post.tags,
        media: post.media,
        category: post.category,
        liked: post.postLikes.length > 0
      }));

      res.json({"posts":postsWithLikes});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  //announcement working done 
  router.get('/clubs/:clubName/announcement',async (req, res) => {
    console.log("this is with announcements");
    const { clubName } = req.params;
    
    // Fetch club information
    const clubInfo = await Clubs.findOne({ where: { clubName: clubName } });
    
    if (!clubInfo) {
      return res.status(404).json({ message: `No clubs exist with the name ${clubName}` });
    }
    
    const clubId = clubInfo.clubId;
    const userId = req.session.sub;
    
    
    try {
      // Check if the user is a member of the club
      const isUserPresent = await ClubStatuses.findOne({
        where: { userId: userId, clubId: clubId }
      });
      
  
      if (!isUserPresent) {
        return res.status(403).json({ message: "Please join this club to check announcements." });
      }
      
  
      // Fetch posts for the club
      const posts = await Posts.findAll({
        where: { 
          clubid: clubId.toString(),
          category: 'announcement' // Filter posts by category
        },
        include: [
          {
            model: Users,
            as: 'user', 
            attributes: ['avatar', 'username']
          },
          {
            model: PostLikes,
            as: 'postLikes',
            where: { userId: userId },
            required: false
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
  
      // Transform posts into plain JSON
      const postsWithLikes = posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        userId: post.userId,
        avatar: post.user.avatar,
        username: post.user.username,
        likes: post.postLikes.length,
        tags: post.tags,
        media: post.media,
        category: post.category,
        liked: post.postLikes.length > 0
      }));
  
      return res.status(200).json({"posts":postsWithLikes,"isAdmin":isUserPresent.isAdmin});
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.post("/clubs/join",  async (req, res) => {
    const { clubName } = req.body;
    const userId = req.session.sub;
  
    try {
      // Check if the club exists by its name
      const club = await Clubs.findOne({ where: { clubName: clubName } });

      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
  
      // Check if the user exists
      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user is already a member of the club
      const existingMembership = await ClubStatuses.findOne({
        where: {
          userId: userId,
          clubId: club.clubId,
          leftAt: null, // User is still a member if leftAt is null
        },
      });
      if (existingMembership) {
        return res.status(400).json({ message: "User is already a member" });
      }
  
      // Add the user to the club's members
      await ClubStatuses.create({
        userId: userId,
        clubId: club.clubId,
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
    const {  clubId } = req.body;
    const userId =req.session.sub

    try {
      const user = await Users.findByPk(userId);
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
    const { clubId, toBeAdminUsername } = req.body;
    const  userId = req.session.sub

    try {
      const user = await Users.findByPk(userId);
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
      const toBeAdmin = await Users.findOne({
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
      await isUserPresent.save();
      res.status(200).json({ message: "User is now an admin of the club" });
    } catch (error) {
      console.error("Error making user an admin:", error);
      res.status(500).json({ message: "Failed to make user an admin" });
    }
  });
router.get('/clubs/events/:clubName', async (req, res) => {
  const { clubName } = req.params;
  console.log("this is with club events events");
  console.log(clubName);
  
  
  try{

    const clubInfo = await Clubs.findOne({ where: { clubName: clubName } });
    if(!clubInfo){
      return res.status(404).json({message:`No clubs exists with the name ${clubName}`})
    }
    const clubId = clubInfo.clubId;
    const events = await Event.findAll({
      where: { clubId: clubId },
      order: [['dateOfEvent', 'ASC']]
    });
    res.json(events);
  }catch(error){
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
);
  module.exports = router;
