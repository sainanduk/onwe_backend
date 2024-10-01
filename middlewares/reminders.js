const moment = require('moment');
const { Op } = require('sequelize');
const RemindEvent = require('../models/RemindEvents');
const sendeventmails = require('./sendVerificationEmail');

async function deletePastEvents() {
  try {
    const today = moment().startOf('day'); // Get today's date without time

    // Delete events where dateOfEvent is less than today's date
    const deletedEventsCount = await RemindEvent.destroy({
      where: {
        dateOfEvent: {
          [Op.lt]: today.format('MM-DD-YYYY') // Compare with today in 'MM-DD-YYYY' format
        }
      }
    });

    if (deletedEventsCount === 0) {
      console.log('No past events found to delete');
      return { message: 'No past events found to delete' };
    }

    console.log(`Successfully deleted ${deletedEventsCount} past events`);
    return { message: `Successfully deleted ${deletedEventsCount} past events` };
  } catch (error) {
    console.error('Error deleting past events:', error);
    throw new Error('Failed to delete past events');
  }
}
async function sendEventReminders() {
  try {
    // Get tomorrow's date
    const tomorrow = moment().add(1, 'days').startOf('day').format('YYYY-MM-DD');

    // Find all reminders for events happening tomorrow
    const reminders = await RemindEvent.findAll({
      where: {
        dateOfEvent: {
          [Op.eq]: tomorrow, // Only get events happening exactly tomorrow
        }
      },
      include: [
        {
          model: Event, // Join with Event model
          attributes: ['title', 'dateOfEvent', 'time', 'description', 'category']
        }
      ]
    });

    // Send emails to all users
    for (const reminder of reminders) {
      const event = reminder.event;
      const emailContent = `
        Hello,

        This is a reminder for the upcoming event: ${event.title}
        
        Event Details:
        Date: ${moment(event.dateOfEvent).format('MM-DD-YYYY')}
        Time: ${event.time}
        Description: ${event.description || 'No description available'}

        Please make sure to attend.

        Regards,
        onwe Event Team
      `;

      await sendeventmails({
        to: reminder.userEmail,
        subject: `Reminder: Upcoming Event - ${event.title}`,
        text: emailContent
      });
    }

    console.log('Emails sent successfully');
    return { message: 'Reminder emails sent successfully' };
  } catch (error) {
    console.error('Error sending event reminders:', error);
    throw new Error('Failed to send reminder emails');
  }
}
module.exports = deletePastEvents;
