const express = require("express")
const router = express.Router()
const Posts =require('../models/Posts')
const Clubs =require('../models/Clubs')
const PostLikes = require('../models/postLikes')
const Users = require('../models/Users')
const verifier = require("../middlewares/verifier")


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
router.get('/top-posts', async (req, res) => {
    const id = req.session.sub
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 16; // Default to 16 items per page if not provided
  
    const offset = (page - 1) * limit; 
    
    try {
        const Top_posts = await Posts.findAll({
            attributes: ['id', 'media', 'description', 'likes'],
            include: [
                {
                    model: Users, 
                    as: 'user',
                    attributes: ['avatar', 'username'],
                },
                {
                    model: PostLikes,
                    as: 'postLikes',
                    where: { userId: id },
                    required: false,
                }
            ],
            order: [['likes', 'DESC']],
            limit: limit,
            offset:offset
        });

        const postsWithLikes = Top_posts.map(post => ({
            id: post.id,
            description: post.description,
            avatar: post.user ? post.user.avatar : null, 
            username: post.user ? post.user.username : null, 
            likes: post.likes,
            media: post.media,
            liked: post.postLikes.length > 0 
        }));

        return res.json(postsWithLikes);
    } catch (error) {
        console.error('Error fetching top posts:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports=router