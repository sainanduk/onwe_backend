const cron = require('node-cron');
const { sequelize} = require('../Config/database');
const Clubs = require('../models/Clubs')
const trending = require('../models/Trending')

const trendingClubs = async () => {
  try {
    // Step 1: Fetch the top 3 clubs
    const topClubs = await Clubs.findAll({
      order: [['members', 'DESC']], 
      limit: 3
    });
    console.log("Fetched clubs:");
    console.log(topClubs);

    // Step 2: Erase existing data in the trending table
    const deletedCount = await trending.destroy({
      where: {}, // Deletes all entries
      truncate: true // Resets the table and primary keys
    });
    console.log(`Deleted ${deletedCount} rows from trending table`);

    // Step 3: Insert the top 3 clubs into the trending table
    const trendingData = topClubs.map(club => ({
      // Assuming your Trending table has these columns
      name: club.clubName,
      members: club.members,
      slogan: club.slogan, // Include any other necessary fields
      coverimage: club.coverImage[0] // Adjust field names as needed
    }));

    await trending.bulkCreate(trendingData); // Bulk insert the top 3 clubs
    console.log('Trending clubs updated successfully');
  } catch (error) {
    console.error('Error updating trending clubs:', error);
  }
};

  
  // Export the trendingClubs function for use in other modules
  module.exports = trendingClubs;