// // Admins model
// const Admins = sequelize.define('admins', {
//     id: { type: DataTypes.STRING, primaryKey: true },
//     username: DataTypes.STRING,
//     email: DataTypes.STRING,
//     fullname: DataTypes.STRING,
//     avatar: DataTypes.STRING,
//     coverimg: DataTypes.STRING,
//     password: DataTypes.STRING,
//     refreshToken: DataTypes.STRING,
//     createdAt: DataTypes.DATE,
//     updatedAt: DataTypes.DATE
//   });
  
//   // Comments model
//   const Comments = sequelize.define('comments', {
//     id: { type: DataTypes.STRING, primaryKey: true },
//     postId: { type: DataTypes.STRING, references: { model: 'posts', key: 'id' } },
//     userId: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
//     content: DataTypes.STRING,
//     replies: DataTypes.ARRAY(DataTypes.STRING),
//     createdAt: DataTypes.DATE
//   });
  
//   // Magazines model
//   const Magazines = sequelize.define('magazines', {
//     id: { type: DataTypes.STRING, primaryKey: true },
//     imageFile: DataTypes.STRING,
//     owner: { type: DataTypes.STRING, references: { model: 'admins', key: 'id' } },
//     title: DataTypes.STRING,
//     description: DataTypes.STRING,
//     likes: DataTypes.INTEGER,
//     isPublished: DataTypes.BOOLEAN,
//     createdAt: DataTypes.DATE
//   });
  
//   // Posts model
//   const Posts = sequelize.define('posts', {
//     id: { type: DataTypes.STRING, primaryKey: true },
//     title: DataTypes.STRING,
//     description: DataTypes.STRING,
//     likes: DataTypes.INTEGER,
//     authorId: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
//     media: DataTypes.ARRAY(DataTypes.JSONB),
//     comments: DataTypes.ARRAY(DataTypes.STRING),
//     createdAt: DataTypes.DATE,
//     updatedAt: DataTypes.DATE
//   });
  
//   // Users model
//   const Users = sequelize.define('users', {
//     id: { type: DataTypes.STRING, primaryKey: true },
//     username: DataTypes.STRING,
//     email: DataTypes.STRING,
//     fullname: DataTypes.STRING,
//     avatar: DataTypes.STRING,
//     bio: DataTypes.STRING,
//     department: DataTypes.STRING,
//     role: DataTypes.BOOLEAN,
//     coverimg: DataTypes.STRING,
//     password: DataTypes.STRING,
//     refreshToken: DataTypes.STRING,
//     createdAt: DataTypes.DATE,
//     updatedAt: DataTypes.DATE
//   });
  
//   // Event model
//   const Event = sequelize.define('event', {
//     id: { type: DataTypes.STRING, primaryKey: true },
//     Title: DataTypes.STRING,
//     subtitle: DataTypes.STRING,
//     DateofEvent: DataTypes.DATE,
//     description: DataTypes.STRING,
//     user_remind: DataTypes.ARRAY(DataTypes.STRING),
//     categorie: DataTypes.STRING,
//     createdAt: DataTypes.DATE,
//     updatedAt: DataTypes.DATE
//   });
  
//   // Clubs model
//   const Clubs = sequelize.define('clubs', {
//     id: { type: DataTypes.STRING, primaryKey: true },
//     name: DataTypes.STRING,
//     admin: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
//     members: DataTypes.ARRAY(DataTypes.STRING),
//     posts: DataTypes.ARRAY(DataTypes.STRING),
//     createdAt: DataTypes.DATE
//   });
  
//   // Define associations (relationships) between models
//   Comments.belongsTo(Posts, { foreignKey: 'postId' });
//   Comments.belongsTo(Users, { foreignKey: 'userId' });
//   Clubs.belongsTo(Users, { foreignKey: 'admin' });
//   Magazines.belongsTo(Admins, { foreignKey: 'owner' });
//   Posts.belongsTo(Users, { foreignKey: 'authorId' });
  
//   // Synchronize models with database
//   sequelize.sync()
//     .then(() => {
//       console.log('Database and tables synced');
//     })
//     .catch(err => {
//       console.error('Error syncing database:', err);
//     });
//   module.exports = {
//     Admins,
//     Comments,
//     Magazines,
//     Posts,
//     Users,
//     Event,
//     Clubs,
//     sequelize
//   };
  