//libraries
const express = require('express');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');
const mongoosedataBase = require('./connectDB');
//files
const serviceAccount = require('./config');
const intent_functions = require('./intentFunctions');
const db_functions = require('./functionsDB');
//dataBase models
const ChatbotUser = require('./Models/ChatbotUsers');
const { findOne } = require('./Models/ChatbotUsers');

// Set up Google Calendar Service account credentials
serviceAccountAuth = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: serviceAccount.scopes
   });

const app = express();
ChatbotUser.find({}, (err, resp)=>{
  if(err) return console.log('error', err);
  console.log(resp);
});

app.get('/', function (req, res) {
  res.send('Hello World')
});

app.post('/webhook', express.json(), function (req, res) {
  const agent = new WebhookClient({ request: req, response: res });
  console.log("Parameters", agent.parameters);
  function insertEvent() {return intent_functions.makeAppointment(agent)}
  function deleteEvent() {return intent_functions.deleteAppointment(agent)}
  function updateEvent() {return intent_functions.updateAppointment(agent)}
  function insertDB() {return db_functions.saveUserData(agent)}
  // Handle the Dialogflow intent named 'Schedule Appointment'.
  let intentMap = new Map();
  intentMap.set('insert_event', insertEvent );
  intentMap.set('delete_event', deleteEvent );
  intentMap.set('update_event', updateEvent );
  intentMap.set('insertDB', insertDB );
  agent.handleRequest(intentMap);
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, () => {
    console.log('Listening on port %d', server_port);
});

