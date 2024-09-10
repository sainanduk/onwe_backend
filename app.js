const express = require('express');
const bodyParser = require('body-parser');
const cors =require('cors')
const cron =require('node-cron')
const { sequelize} = require('./Config/database');
const app = express();
app.use(bodyParser.json());
app.use(cors())


//models
const Admins = require('./models/Admins');
const UserFollowers = require('./models/userfollowers');
const Clubs = require('./models/Clubs');
const Comments = require('./models/Comments');
const Event = require('./models/Event');
const Magazines = require('./models/Magazines');
const Posts = require('./models/Posts');
const Users = require('./models/Users');
const PostLikes = require('./models/postLikes.js')
const ClubStatus =require('./models/clubstatuses.js')
const PollOptions = require('./models/PollOptions.js');
const Polls = require('./models/Polls.js');
const Votes = require('./models/Votes.js')
const pollOption = require('./models/PollOptions.js')

//middleware
const verifier = require('./middlewares/verifier.js')
const deleteOldPosts =require('./middlewares/deletepostsinterval.js')


//routes
const EventRoutes =require('./Routes/event_routes.js')
const UserUpdateRoute = require('./Routes/Users_route.js')
const FollowersFollowing =require('./Routes/followersandfollowing.js')
const magazineRoutes=require('./Routes/magazines_route.js')
const ExploreRoutes=require('./Routes/explore_route.js')
const clubRoutes=require('./Routes/Clubs_route.js')
const updateusers =require('./Routes/Users_route.js');
const polls_route =require('./Routes/polls_route.js')
const artical=require('./Routes/artical_routes.js')
const authRoutes = require('./Routes/authroutes.js')
const searchRoute = require('./Routes/search_route.js')
const postsRoutes = require('./Routes/Post_route.js'); 
const commentsRoutes = require('./Routes/Comments_route.js');
const usernameRoutes = require('./Routes/username_route.js');



//admin
const createclub =require('./Admin_Routes/club_routes.js')
const createevent =require('./Admin_Routes/event_routes.js')
const createmagazine = require('./Admin_Routes/magazines_routes.js')

//mobile
const mobileexplore  =require('./mobile/Routes/mobile_explore_route.js')
const mobileposts = require('./mobile/Routes/mobile_Post_route.js')
const mobilemagazines =require('./mobile/Routes/mobile_magazines_route.js')
const mobilesearch = require('./mobile/Routes/mobile_search_route.js')
const mobileLogin = require("./mobile/signin.js");
const mobileVerifier = require('./mobile/middleware/mobileverifier.js')
const mobileevents = require('./mobile/Routes/mobile_event_routes.js')






//mobile routes
// app.use(mobileLogin);
// app.use(mobileposts)
// app.use(mobileexplore)
// app.use(mobilemagazines)
// app.use(mobilesearch)
// app.use(mobileevents)
//web routes
app.use(searchRoute);
app.use(verifier,clubRoutes);
app.use(authRoutes);
app.use(magazineRoutes);
app.use(EventRoutes)
app.use(postsRoutes);
app.use(verifier,ExploreRoutes)
app.use(commentsRoutes);
app.use(updateusers)
app.use(polls_route)
app.use(artical)
app.use(FollowersFollowing)

//admin routes
app.use(createclub)
app.use(createevent)
app.use(createmagazine)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

Posts.belongsTo(Users, { as: 'user', foreignKey: 'userid' });
Posts.hasMany(Comments, { foreignKey: 'postId', as: 'postComments' });
Posts.hasMany(PostLikes, { foreignKey: 'postId', as: 'postLikes' });

Users.hasMany(Comments, { foreignKey: 'userId', as: 'userComments' });
Users.hasMany(Clubs, { foreignKey: 'admin', as: 'adminClubs' });
Users.hasMany(Posts, { as: 'posts', foreignKey: 'userid' });
// Users.hasMany(UserFollowers, { foreignKey: 'followers', as: 'followers' });
//Users.hasMany(UserFollowers, { foreignKey: 'following', as: 'following' });
// Associate Users with UserFollowers where the user is the one being followed
Users.hasMany(UserFollowers, { 
  foreignKey: 'following', 
  sourceKey: 'username',  
  as: 'followers'          
});

// Associate Users with UserFollowers where the user is the one following others
Users.hasMany(UserFollowers, { 
  foreignKey: 'follower',  
  sourceKey: 'username',   
  as: 'followings'        
});



Users.hasMany(ClubStatus, { foreignKey: 'userId' });

Admins.hasMany(Magazines, { foreignKey: 'owner', as: 'ownedMagazines' });


PostLikes.belongsTo(Posts, { foreignKey: 'postId' });
PostLikes.belongsTo(Users, { foreignKey: 'userId' });

Clubs.hasMany(ClubStatus, { foreignKey: 'clubId' });
ClubStatus.belongsTo(Clubs, { foreignKey: 'clubId' });
ClubStatus.belongsTo(Users, { foreignKey: 'userId' });



Polls.hasMany(PollOptions, { foreignKey: 'pollId', as: 'PollOptions' }); 
Polls.hasMany(Votes, { foreignKey: 'pollId', as: 'PollVotes' });



PollOptions.belongsTo(Polls, { foreignKey: 'pollId', as: 'Poll' });


Comments.belongsTo(Posts, { foreignKey: 'postId' });
Comments.belongsTo(Users, { foreignKey: 'userId' });

Magazines.belongsTo(Admins, { foreignKey: 'owner' });

Votes.belongsTo(PollOptions, { foreignKey: 'pollOptionId', as: 'Option' });


const initializeDatabase = async () => {
  try {
    await sequelize.authenticate({alter:true});
    console.log('Connection to the database has been established successfully.');

    await sequelize.sync({alter:true}); 
    console.log('Database and tables have been synced successfully.');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
};


initializeDatabase();


cron.schedule('0 * * * *', () => {
  console.log('Running scheduled job to delete old posts');
  deleteOldPosts();
});

// const PORT =  process.env[2]|| process.env.PORT||3000;
const PORT=3005
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
