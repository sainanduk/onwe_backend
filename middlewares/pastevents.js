const Event= require('../models/Event')

async function deletePastEvents() {
    try {
      // Define the current date
      const currentDate = new Date();
  
      // Delete events where the eventDate is before the current date
      const result = await Event.destroy({
        where: {
          eventDate: {
            [Op.lt]: currentDate, // Less than the current date
          },
        },
      });
  
      console.log(`${result} past events deleted successfully.`);
    } catch (error) {
      console.error('Error deleting past events:', error);
    }
  }
module.exports=deletePastEvents