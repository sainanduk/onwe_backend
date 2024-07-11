const express = require("express")
const router = express.Router()
const Posts =require('../models/Posts')
const Clubs =require('../models/Clubs')


router.get('/topclubs',async(req,res)=>{
    try{
    const Topclubs= await Clubs.findAll({
        attributes:['clubId','clubName','coverImage','slogan'],
        order:[['members','DESC']],
        limit:3
})
    
    return res.json(Topclubs)
}catch{
    res.status(500).json({message:"Error fetching top clubs"})
}
})
router.get('/top-posts',async(req,res)=>{

    try{
    const Top_posts= await Posts.findAll({
        attributes:['id','media'],
        order:[['likes','DESC']],
        limit:15
    })
    return res.json(Top_posts)
}catch{
    res.status(500).json({message:"Error fetching top posts"})
}
})

module.exports=router