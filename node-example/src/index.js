// Import necessary modules
const nunjucks = require('nunjucks');
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const path = require('path');
const bcrypt = require('bcrypt');

// Set up Express application
const app = express();
app.use(express.json()); // Middleware to parse JSON data
app.set('view engine', 'ejs'); // Setting up EJS as the view engine
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// Configure Nunjucks
nunjucks.configure(['views/'], {
  autoescape: true,
  express: app
});

// Setting up MongoDB connection
async function mongoConnect() {
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb+srv://lscott:Mine513jw62@clusterghms.mqurwz8.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  return await client.connect(); // Connecting to the MongoDB database
}

// Express routes
// Route to render the homepage
app.get('/', async (req, res) => {
  res.render('greenhouse.ejs');
});

// Route to send a static HTML page
app.get('/home', async (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Login route
app.get('/login', async (req, res) => {
  res.render('login.ejs');
});

// Login form submission route
app.post('/login', async function(req, res){
  try {
    // Connecting to MongoDB
    connection = await mongoConnect();
    db = connection.db("GHMS");
    users = db.collection('Users');
    documents = await users.find({}).toArray();
    response_json = JSON.stringify(documents);

    // Checking username and password
    const user = await users.findOne({ username: req.body.username });

    // Comparing hashed passwords
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      return res.redirect('/menu?user=' + encodeURIComponent(user.username));
    }
    // Rendering login page with error message if authentication fails
    res.render('login.ejs',{ error: "Username or password is incorrect" });

  } catch (error) {
    // Handling errors
    res.status(400).json({ error });
  }
});

// Route for historical data
app.get('/historical', async (req, res) => {
  // Connecting to MongoDB and retrieving historical sensor data
  connection = await mongoConnect();
  db = connection.db("GHMS");
  histsensors = db.collection('History');
  documents = await histsensors.find({}).toArray();
  response_json = JSON.stringify(documents);
  return res.render("historical.ejs", {histsensors:documents});  
});

// Route for environmental selection
app.get('/envselect', async (req, res) => {
  // Connecting to MongoDB and retrieving sensor data for environmental selection
  connection = await mongoConnect();
  db = connection.db("GHMS");
  sensors = db.collection('Sensors');
  documents = await sensors.find({}).toArray();
  response_json = JSON.stringify(documents);
  return res.render("envselect.ejs", {sensors:documents}); 
});

// Route for changing greenhouse
app.get('/changegreenhouse', async (req, res) => {
  // Connecting to MongoDB and retrieving sensor data for changing greenhouse settings
  connection = await mongoConnect();
  db = connection.db("GHMS");
  sensors = db.collection('Sensors');
  documents = await sensors.find({}).toArray();
  response_json = JSON.stringify(documents);
  return res.render("changegreenhouse.ejs", {sensors:documents}); 
});

// Route for greenhouse data
app.get('/greenhouse', async (req, res) => {
  // Connecting to MongoDB and retrieving sensor and actuator data for greenhouse monitoring
  connection = await mongoConnect();
  db = connection.db("GHMS");
  sensors = db.collection('Sensors');
  documents = await sensors.find({}).toArray();
  actuators = db.collection('Actuators');
  documents2 = await actuators.find({}).toArray();
  response_json = JSON.stringify(documents);
  return res.render("greenhouse.ejs", {sensors:documents, actuators:documents2});
});

// Route to get sensor data
app.get('/getsensordata', async (req, res) => {
  // Connecting to MongoDB and retrieving sensor data
  connection = await mongoConnect();
  db = connection.db("GHMS");
  sensors = db.collection('Sensors');
  documents = await sensors.find({}).toArray();
  res.setHeader('Content-Type', 'application/json');
  return res.json(documents);
});

// Route to get actuator states
app.get('/getactuatorstates', async (req, res) => {
  try {
    // Connecting to MongoDB and retrieving actuator states
    connection = await mongoConnect();
    db = connection.db("GHMS");
    actuators = db.collection('Actuators');
    documents = await actuators.find({}).toArray();
    res.setHeader('Content-Type', 'application/json');
    return res.json(documents);
  } catch (error) {
    // Handling errors
    console.error("Error retrieving actuator states:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get plant profile
app.get('/getplantprofile', async (req, res) => {
  // Connecting to MongoDB and retrieving plant profile data
  connection = await mongoConnect();
  db = connection.db("GHMS");
  profile = db.collection('PlantProfiles');
  documents = await profile.find({}).toArray();
  res.setHeader('Content-Type', 'application/json');
  return res.json(documents);
});

// Route to get actuators
app.get('/getactuators', async (req, res) => {
  // Connecting to MongoDB and retrieving actuator data
  connection = await mongoConnect();
  db = connection.db("GHMS");
  profile = db.collection('Actuators');
  documents = await profile.find({}).toArray();
  res.setHeader('Content-Type', 'application/json');
  return res.json(documents);
});

// Route to update actuators
const { MongoClient, ObjectId } = require('mongodb');

// Update actuators route - THIS CODE UPDATES THE ACTUATORS
app.post('/updateactuator/:actuatorName', async (req, res) => {
  try {
    const { actuatorName } = req.params;
    const newData = req.body;

    // Connecting to MongoDB and updating specific actuator's data
    const connection = await mongoConnect();
    const db = connection.db("GHMS");
    const profile = db.collection('Actuators');

    await profile.updateOne({ actuator_name: actuatorName }, { $set: newData });

    // Fetching the updated data from the database
    const updatedData = await profile.findOne({ actuator_name: actuatorName });

    // Responding with the updated data
    res.setHeader('Content-Type', 'application/json');
    return res.json(updatedData);
  } catch (error) {
    // Handling errors
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Error updating data" });
  }
});

// Route for menu
app.get('/menu',(req, res) => {
  // Retrieving username from query parameters and rendering the menu page
  let user = req.query.user;
  return res.render("menu.ejs", {user});
});

// Route for Settings
app.get('/settings', (req, res) => {
  // Rendering the settings page
  res.render('settings');
});

// Start server
const port = 3000;
app.listen(port, () => {
  // Starting the server and listening on specified port
  console.log(`Example app listening on port ${port}`);
});
