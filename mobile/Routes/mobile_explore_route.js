const express = require("express")
const router = express.Router()
const Posts =require('../../models/Posts')
const Clubs =require('../../models/Clubs')
const PostLikes = require('../../models/postLikes')
const Users = require('../../models/Users')
const mobileVerifier = require('../middleware/mobileverifier')
router.get('/mobile/topclubs',mobileVerifier,async(req,res)=>{
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
router.get('/mobile/top-posts', mobileVerifier,async (req, res) => {
    const id = req.userid
    console.log(id);
    try {
        const Top_posts = await Posts.findAll({
            attributes: ['id', 'title', 'media', 'description', 'likes', 'category', 'tags', 'userid'],
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
            limit: 15
        });

        const postsWithLikes = Top_posts.map(post => ({
            id: post.id,
            title: post.title,
            description: post.description,
            userid: post.userid,
            avatar: post.user ? post.user.avatar : null, 
            username: post.user ? post.user.username : null, 
            likes: post.likes,
            tags: post.tags,
            media: post.media,
            category: post.category,
            liked: post.postLikes.length > 0 
        }));

        return res.json(postsWithLikes);
    } catch (error) {
        console.error('Error fetching top posts:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports=router