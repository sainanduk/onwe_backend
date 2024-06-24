// Relationships.js
const { sequelize } = require('../Config/database');
const Comments = require('./Comments');
const Posts = require('./Posts');
const Users = require('./Users');
const Clubs = require('./Clubs');
const Magazines = require('./Magazines');
const Admins = require('./Admins');

Comments.belongsTo(Posts, { foreignKey: 'postId' });
Comments.belongsTo(Users, { foreignKey: 'userId' });
Clubs.belongsTo(Users, { foreignKey: 'admin' });
Magazines.belongsTo(Admins, { foreignKey: 'owner' });
Posts.belongsTo(Users, { foreignKey: 'authorId' });

// Syncing database and tables
sequelize.sync()
  .then(() => {
    console.log('Database and tables synced');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
