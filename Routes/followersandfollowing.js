const express = require('express');
const router = express.Router();
const userfollowers = require('../models/userfollowers');
const verifier = require('../middlewares/verifier');


router.post('/checkfollow', async (req, res) => {
  const {  followUsername } = req.body;
  const username =req.session.userName
  console.log("this is check follow checking requests");


  
  try {

    if(!followUsername && !username){
      return res.status(400).send("username and following missing")
    }
    else if(followUsername===username){
      const followingCountPromise = await userfollowers.count({
        where: { follower: username }
    });
  
    const followersCountPromise = await userfollowers.count({
        where: { following:followUsername }
    });
  
      return res.status(200).json({ status: false,followers:followersCountPromise,following:followingCountPromise });
    }
    else if(username && followUsername)
    {
    const isFollowing = await userfollowers.findOne({
      where: {
        follower: username,
        following: followUsername
      }
    });
    const followingCountPromise = await userfollowers.count({
      where: { follower: followUsername }
  });

  
  const followersCountPromise = await userfollowers.count({
      where: { following:followUsername }
  });
    if (isFollowing) {
      return res.status(200).json({ status: true ,followers:followersCountPromise,following:followingCountPromise});
    } else {
      return res.status(200).json({ status: false,followers:followersCountPromise,following:followingCountPromise });
    }
  }
  } catch (error) {
    console.error('Error checking if user is following:', error);
    res.status(500).json({ message: 'Failed to check if user is following' });
  }
});


// Route to follow a user
router.post('/follow',verifier, async (req, res) => {
  const {  followUsername } = req.body;
  const username=req.session.userName
  console.log("this is follow checking requests");

  console.log(followUsername, username)
  try {
    
    const followingUser = await userfollowers.findOne({ 
      where: { follower: username, following: followUsername } 
    });

    if (followingUser) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    await userfollowers.create({ follower: username, following: followUsername });

    return res.status(201).json({ message: 'Successfully followed' ,status:true});
  } catch (error) {
    console.error('Error following user:', error);
    return res.status(500).json({ message: 'Failed to follow user' ,status:false});
  }
});


// Route to unfollow a user
router.post('/unfollow',verifier, async (req, res) => {
  const {  unfollowUsername } = req.body;
  const username=req.session.userName
  console.log("this is unfollow checking requests");

  try {
    // Delete records from UserFollowers table
    console.log("hi");
    
    await userfollowers.destroy({ where: { follower: username, following: unfollowUsername } });
    console.log("hello");
    
    return  res.status(200).json({ message: 'Successfully unfollowed' ,status:false});
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return res.status(500).json({ message: 'Failed to unfollow user',status:true });
  }
});


module.exports = router;
