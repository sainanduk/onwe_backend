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

//create posts and announcements in club
  router.post('/clubs/posts', verifier, uploadImages, processimages, async (req, res) => {
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
  
      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Failed to create post' });
    }
  });


  router.get('/myclubs', verifier, async (req, res) => {
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


  // router.get('/myclubs/:clubname',verifier,async(req,res)=>{
  //     const clubname =req.params;
  //     const userId = req.session.sub;

  //     try{
  //     const Clubinfo =await Clubs.findOne({where:{
  //       clubName:clubname
  //     }})

  //     if(!Clubinfo){
  //       return res.send("Club does not there");
        
  //     }

  //     const clubstatsinfo = await ClubStatuses.findOne({
  //       where:{
  //         clubId: Clubinfo.clubId,
  //         userId: userId
  //       }
  //     })
      
  //     if(!clubstatsinfo){
  //       return res.send(false);
  //     }
  //     else{
  //       const posts = await Posts.findAll({
  //         where: { clubid: Clubinfo.clubId },
  //         include: [
  //           {
  //             model: Users,
  //             as: 'user',
  //             attributes: ['avatar', 'username']
  //           },
  //           {
  //             model: PostLikes,
  //             as: 'postLikes',
  //             where: { userId: userId },
  //             required: false 
  //           }
  //         ],
  //         order: [['createdAt', 'DESC']]
  //       });
        
  //       // Map posts to transform Sequelize objects into plain JSON
  //       const postsWithLikes = posts.map(post => ({
  //         id: post.id,
  //         title: post.title,
  //         description: post.description,
  //         userid: post.userid,
  //         avatar:post.user.avatar,
  //         username: post.user ? post.user.username : null, // Access the username from the included User model
  //         likes: post.likes,
  //         tags: post.tags,
  //         media: post.media,
  //         category: post.category,
  //         liked: post.postLikes.length > 0 // Check if there are likes for the user
  //       }));
        
  //       res.json(clubstatsinfo.isAdmin);
  //     }
  //   }
  //   catch(error){  
      
  //     res.status(404).send("Error in fetching post ",error)
    
  //   }
  // })

  // general working done 
  router.get('/clubs/:clubName/general', verifier, async (req, res) => {  
    console.log("0");
    const { clubName } = req.params;
    const clubInfo = await Clubs.findOne({ where: { clubName: clubName } });
    if(!clubInfo){
      return res.status(404).json({message:`No clubs exists with the name ${clubName}`})
    }
    const clubId = clubInfo.clubId;

    const userId = req.session.sub;
    console.log("genearl log 1");
    try {
      // Fetch club information
      const clubInfo = await Clubs.findOne({
        where: { clubName: clubName }
      });
      console.log("genaeral log 2");

      if (!clubInfo) {
        return res.status(404).json({ message: "Club not found" });
      }
      console.log(" g log 3");

      // const clubId = clubInfo.clubId; // Retrieve the clubId
      // const userId = req.session.sub; // Assuming you have a way to get the userId from the verifier middleware

      // Check if the user is a member of the club
      const isUserPresent = await ClubStatuses.findOne({
        where: { userId: userId, clubId: clubId },
        attributes: ['clubId']
      });
      console.log(" g log 4");

      if (!isUserPresent) {
        return res.status(403).json({ message: "Please join this club to check announcements." });
      }
      console.log("g log 5");

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
  router.get('/clubs/:clubName/announcement', verifier, async (req, res) => {
    console.log("0");
    const { clubName } = req.params;
    
    // Fetch club information
    const clubInfo = await Clubs.findOne({ where: { clubName: clubName } });
    
    if (!clubInfo) {
      return res.status(404).json({ message: `No clubs exist with the name ${clubName}` });
    }
    
    const clubId = clubInfo.clubId;
    const userId = req.session.sub;
    console.log("log 1");
    
    try {
      // Check if the user is a member of the club
      const isUserPresent = await ClubStatuses.findOne({
        where: { userId: userId, clubId: clubId }
      });
      console.log("log 4");
  
      if (!isUserPresent) {
        return res.status(403).json({ message: "Please join this club to check announcements." });
      }
      console.log("log 5");
  
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
      console.log("log 6");
  
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
  

  // Route to make an announcement
  // router.post("/clubs/announcement",
  //   uploadImages,
  //   processimages,
  //   async (req, res) => {
  //     const { userId, clubId, message, title, tags } = req.body;

  //     try {
  //       const club = await Clubs.findByPk(clubId);

  //       if (!club) {
  //         return res.status(404).json({ message: "Club not found" });
  //       }

  //       // Create a new post for the announcement
  //       const newPost = await Posts.create({
  //         title: title,
  //         description: message,
  //         likes: 0,
  //         userid: userId,
  //         media: req.mediaData.map((img) => img.base64String),
  //         category: "announcement",
  //         tags: tags,
  //         clubid: clubId,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       });

  //       res
  //         .status(201)
  //         .json({ message: "Announcement made successfully", post: newPost });
  //     } catch (error) {
  //       console.error("Error making announcement:", error);
  //       res.status(500).json({ message: "Failed to make announcement" });
  //     }
  //   }
  // );

  // Route to get all announcements for a specific club
  // router.get("/clubs/:clubName/announcements", verifier,async (req, res) => {
  //   const { clubName } = req.params;

  //   try {
  //     const announcements = await Posts.findAll({
  //       where: {
  //         clubName: clubName,
  //         category: "announcement",
  //       },
  //       order:[['createdAt','DESC']]
  //     });

  //     if (announcements.length === 0) {
  //       return res
  //         .status(404)
  //         .json({ message: "No announcements found for this club" });
  //     }

  //     res.status(200).json({ announcements });
  //   } catch (error) {
  //     console.error("Error fetching announcements:", error);
  //     res.status(500).json({ message: "Failed to fetch announcements" });
  //   }
  // });

  router.post("/clubs/join", verifier, async (req, res) => {
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
          clubId: club.id,
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
    const { userId, clubId } = req.body;

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
    const { userId, clubId, toBeAdminUsername } = req.body;

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

  module.exports = router;
