const express = require('express');
const router = express.Router();
const trending =require('../models/Trending')

router.get('/trending',async(req,res)=>{
    try {
        const trendingposts = await trending.findAll()
        return res.send(trendingposts)
    } catch (error) {
        res.send(error)
    }
})
module.exports=router