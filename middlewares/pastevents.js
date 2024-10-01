const { Op } = require('sequelize');
const Event= require('../models/Event')

async function deletePastEvents() {
    try {
      // Define the current date
      const currentDate = new Date();
      const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
  
      // Delete events where the eventDate is before the current date
      const result = await Event.destroy({
        where: {
          dateOfEvent: {
            [Op.lt]: formattedDate, 
          },
        },
      });
  
      console.log(`${result} past events deleted successfully.`);
    } catch (error) {
      console.error('Error deleting past events:', error);
    }
  }
module.exports=deletePastEvents