const cron = require('node-cron');
const { sequelize} = require('../Config/database');
const Clubs = require('../models/Clubs')
const trending = require('../models/Trending')

const trendingClubs = async () => {
  try {
    // Step 1: Delete all entries from the trending table using `destroy` with an empty where clause
    const deletedCount = await trending.truncate()
    console.log(`Deleted ${deletedCount} rows from trending table`);

    // Step 2: Fetch the top 3 clubs based on members
    const topClubs = await Clubs.findAll({
      order: [['members', 'DESC']],
      limit: 3
    });

    // Step 3: Prepare trending data for bulk insertion
    const trendingData = topClubs.map(club => ({
      name: club.clubName,
      members: club.members,
      slogan: club.slogan,
      coverimage: club.coverImage && club.coverImage.length > 0 ? club.coverImage[0] : null
    }));

    // Step 4: Insert the top clubs into the trending table
    await trending.bulkCreate(trendingData);
    console.log('Trending clubs updated successfully');
    
  } catch (error) {
    console.error('Error updating trending clubs:', error);
  }
};

  
  // Export the trendingClubs function for use in other modules
  module.exports = trendingClubs;