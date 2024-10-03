function sendEmailBeforeEvent() {
    var calendar = CalendarApp.getCalendarById('your_calendar_id'); // Your calendar ID
    var events = calendar.getEventsForDay(new Date());  // Get events for today
    
    var now = new Date();
    
    events.forEach(function(event) {
      var eventStartTime = event.getStartTime();
      var diffInMilliseconds = eventStartTime - now;
      
      // If the event is within 1 hour (3600000 milliseconds)
      if (diffInMilliseconds <= 3600000 && diffInMilliseconds > 0) {
        MailApp.sendEmail("recipient@example.com", "Event in 1 hour", "Your event '" + event.getTitle() + "' is starting in 1 hour.");
      }
      
      // If the event is within 6 hours (21600000 milliseconds)
      if (diffInMilliseconds <= 21600000 && diffInMilliseconds > 3600000) {
        MailApp.sendEmail("recipient@example.com", "Event in 6 hours", "Your event '" + event.getTitle() + "' is starting in 6 hours.");
      }
    });
  }