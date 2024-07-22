const express = require('express');
const bodyParser = require('body-parser');
const cors =require('cors')
const cron =require('node-cron')
const deleteOldPosts =require('./middlewares/deletepostsinterval.js')
const postsRoutes = require('./Routes/Post_route.js'); 
const commentsRoutes = require('./Routes/Comments_route.js');
const usernameRoutes = require('./Routes/username_route.js');
const { sequelize} = require('./Config/database');
const authRoutes = require('./Routes/authroutes.js')
const searchRoute = require('./Routes/search_route.js')
const UserFollowing = require('./models/userfollowing');
const UserFollowers = require('./models/userfollowers');
const mobileLogin = require("./mobile/routes/signin.js");
const Admins = require('./models/Admins');
const Clubs = require('./models/Clubs');
const Comments = require('./models/Comments');
const Event = require('./models/Event');
const Magazines = require('./models/Magazines');
const Posts = require('./models/Posts');
const Users = require('./models/Users');
const verifier = require('./middlewares/verifier.js')
const EventRoutes =require('./Routes/event_routes.js')
const UserUpdateRoute = require('./Routes/Users_route.js')
const PostLikes = require('./models/postLikes.js')
const FollowersFollowing =require('./Routes/followersandfollowing.js')
const magazineRoutes=require('./Routes/magazines_route.js')
const ClubStatus =require('./models/clubstatuses.js')
const ExploreRoutes=require('./Routes/explore_route.js')
const clubRoutes=require('./Routes/Clubs_route.js')
const updateusers =require('./Routes/Users_route.js');
const PollOptions = require('./models/PollOptions.js');
const Polls = require('./models/Polls.js');
const polls_route =require('./Routes/polls_route.js')
const app = express();
app.use(bodyParser.json());
app.use(cors())

app.use(authRoutes);
app.use(magazineRoutes);
app.use(EventRoutes)
app.use(postsRoutes);
app.use(searchRoute);
app.use(mobileLogin);
app.use(ExploreRoutes)
app.use(commentsRoutes);
app.use(clubRoutes);
app.use(updateusers)
app.use(polls_route)
// app.use('/api',verifier,UserUpdateRoute)
// app.use('/api',verifier,FollowersFollowing)



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Define associations
// Comments.belongsTo(Posts, { foreignKey: "postId" });
// Comments.belongsTo(Users, { foreignKey: "userId" });
// Clubs.belongsTo(Users, { foreignKey: "admin" });
// Magazines.belongsTo(Admins, { foreignKey: "owner" });
// Posts.belongsTo(Users, { foreignKey: "userId" });

// Posts.hasMany(Comments, { foreignKey: "postId", as: "postComments" });
// Users.hasMany(Comments, { foreignKey: "userId", as: "userComments" });
// Users.hasMany(Clubs, { foreignKey: "admin", as: "adminClubs" });
// Admins.hasMany(Magazines, { foreignKey: "owner", as: "ownedMagazines" });
// Users.hasMany(Posts, { foreignKey: "userId", as: "userPosts" });
// Posts.hasMany(PostLikes, { foreignKey: 'postId', as: 'postLikes' });
// PostLikes.belongsTo(Posts, { foreignKey: 'postId' });




// // Users model associations
// Users.hasMany(UserFollowers, { foreignKey: 'userId', as: 'followers' });
// Users.hasMany(UserFollowing, { foreignKey: 'userId', as: 'following' });

// // userfollowers and userfollowing model associations (if needed)
// UserFollowers.belongsTo(Users, { foreignKey: 'followerId', as: 'follower' });
// UserFollowing.belongsTo(Users, { foreignKey: 'followingId', as: 'followed' });
// Comments associations
Posts.belongsTo(Users, { as: 'user', foreignKey: 'userid' });
Posts.hasMany(Comments, { foreignKey: 'postId', as: 'postComments' });
Posts.hasMany(PostLikes, { foreignKey: 'postId', as: 'postLikes' });

Users.hasMany(Comments, { foreignKey: 'userId', as: 'userComments' });
Users.hasMany(Clubs, { foreignKey: 'admin', as: 'adminClubs' });
Users.hasMany(Posts, { as: 'posts', foreignKey: 'userid' });
Users.hasMany(UserFollowers, { foreignKey: 'userId', as: 'followers' });
Users.hasMany(UserFollowing, { foreignKey: 'userId', as: 'following' });
Users.hasMany(ClubStatus, { foreignKey: 'userId' });

Admins.hasMany(Magazines, { foreignKey: 'owner', as: 'ownedMagazines' });

UserFollowers.belongsTo(Users, { foreignKey: 'followerId', as: 'follower' });
UserFollowing.belongsTo(Users, { foreignKey: 'followingId', as: 'followed' });

PostLikes.belongsTo(Posts, { foreignKey: 'postId' });
PostLikes.belongsTo(Users, { foreignKey: 'userId' });

Clubs.hasMany(ClubStatus, { foreignKey: 'clubId' });
ClubStatus.belongsTo(Clubs, { foreignKey: 'clubId' });
ClubStatus.belongsTo(Users, { foreignKey: 'userId' });

Polls.hasMany(PollOptions, { foreignKey: 'pollId', as: 'options' });
PollOptions.belongsTo(Polls, { foreignKey: 'pollId' });

Comments.belongsTo(Posts, { foreignKey: 'postId' });
Comments.belongsTo(Users, { foreignKey: 'userId' });

Magazines.belongsTo(Admins, { foreignKey: 'owner' });



const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Sync all models
    await sequelize.sync(); // force: true will drop tables if they exist, use it carefully
    console.log('Database and tables have been synced successfully.');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
};

// Initialize and sync database
initializeDatabase();

//delete posts after 48 hours
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled job to delete old posts');
  deleteOldPosts();
});
// Start the server
const PORT = 3000||3001||3002||3003;
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
