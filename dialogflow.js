//libraries
const {google} = require('googleapis');
//files
const serviceAccount = require('./config');
const ChatbotUser = require('./Models/ChatbotUsers');
//define a calendar
const calendar = google.calendar('v3');
//set timeZone
const timeZone = 'America/Buenos_Aires';
const timeZoneOffset = '-03:00';

//Creates calendar event in Google Calendar
function createCalendarEvent (dateTimeStart, dateTimeEnd, dni, pet) {
    return new Promise((resolve, reject) => {
      ChatbotUser.findOne({dni_user:dni}, (err, res) => {
        console.log('1:',res);
        if (err || res == null) {
          reject(err || new Error('Not Match'));
        }
      else {
      calendar.events.list({
        auth: serviceAccountAuth, // List events for time period
        calendarId: serviceAccount.calendarId,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString()
      }, (err, calendarResponse) => {
       //functions.logger.log('calendar---->', calendarResponse);
       // Check if there is a event already on the Calendar
       if (err || calendarResponse.data.items.length > 0) {
         console.log('2:',calendarResponse);
         reject(err || new Error('Requested time conflicts with another appointment'));
       }
       else {
          console.log('2:',calendarResponse);
          // Create event for the requested time period
          calendar.events.insert({ auth: serviceAccountAuth,
            calendarId: serviceAccount.calendarId,
            resource: {summary: res.Name_user + ' y ' + pet  +' ', description: res.Name_pet + '<br>' + res.type_pet + '<br>' + 'tel:' + res.phone_number_user+ '<br>' + 'DNI:' + res.dni_user+ '<br>' + res.direction_user,
              start: {dateTime: dateTimeStart},
              end: {dateTime: dateTimeEnd}}
          }, (err, event) => {
            console.log('3:',event);
            err ? reject(err) : resolve(event);
          }
          );
        }
    });
   };
  });
});
};



   const deleteEvent = (dni) => {
       return new Promise((resolve, reject) => {
         //LIST the events
           console.log('iniciaDeleteEventWithId');
           calendar.events.list({
               auth: serviceAccountAuth, // List events for time period
               calendarId: serviceAccount.calendarId,
               q: dni
             }, (err, res) => {
               // Check if there is a event already on the Calendar
               if (err) {
                 reject(err);
               } else {
                 // Delete event with DNI
                 console.log('Respuesta lista :' + res);
                 res.data.items.forEach(event => {
                   calendar.events.delete({
                   auth: serviceAccountAuth,
                   calendarId: serviceAccount.calendarId,
                   eventId: event.id
                 }, (err, event) => {
                   err ? reject(err) : resolve(event);
                   });
                 });
               }
           });
       });
     };

     const updateEvent = (dateTimeStart, dateTimeEnd, dni) => {
       return new Promise((resolve, reject) => {
         //LIST the events
           console.log('iniciaUpdate');
           calendar.events.list({
               auth: serviceAccountAuth, // List events for time period
               calendarId: serviceAccount.calendarId,
               q: dni
             }, (err, res) => {
               // Check if there is a event already on the Calendar
               if (err) {
                 reject(err);
               } else {
                   const calendar_res = res;
                   calendar.events.list({
                       auth: serviceAccountAuth, // List events for time period
                       calendarId: serviceAccount.calendarId,
                       timeMin: dateTimeStart.toISOString(),
                       timeMax: dateTimeEnd.toISOString()
                     }, (err, calendarResponse) => {
                      //functions.logger.log('calendar---->', calendarResponse);
                      // Check if there is a event already on the Calendar
                      if (err || calendarResponse.data.items.length > 0) {
                        reject(err || new Error('Requested time conflicts with another appointment'));
                      }
                      else {
                       calendar_res.data.items.forEach(event => {
                           console.log(calendar_res.data.items);
                           calendar.events.patch({
                            auth: serviceAccountAuth,
                            calendarId: serviceAccount.calendarId,
                            eventId: event.id,
                            resource: {
                               end: {
                                 dateTime: dateTimeEnd
                               },
                               start: {
                                 dateTime: dateTimeStart
                               }
                             }
                          }, (err, event) => {
                            err ? reject(err) : resolve(event);
                            });
                          });
                       }
                     });
               }
           });
       });
     };

   function convertParametersDate(date, time) {
       return new Date(Date.parse(date.split('T')[0] + 'T' + time.split('T')[1].split('-')[0] + timeZoneOffset));
   }

   // A helper function that adds the integer value of 'hoursToAdd' to the Date instance 'dateObj' and returns a new Data instance.
   function addHours(dateObj, hoursToAdd) {
       return new Date(new Date(dateObj).setHours(dateObj.getHours() + hoursToAdd));
   }

module.exports = {
createCalendarEvent,
deleteEvent,
updateEvent,
convertParametersDate,
addHours,
timeZone,
};