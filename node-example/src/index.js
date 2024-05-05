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
app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

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

  return await client.connect();
}

// Express routes
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

// Login form submission
app.post('/login', async function(req, res){
  try {
    connection = await mongoConnect();
    db = connection.db("GHMS");
    users = db.collection('Users');
    documents = await users.find({}).toArray();
    response_json = JSON.stringify(documents);
  
    // const saltRounds = 10;
    // const salt = bcrypt.genSaltSync(saltRounds);
    
    // // Hash a password
    // const plainPassword = req.body.password;
    // const hashedPassword = bcrypt.hashSync(plainPassword, salt);
    // console.log(hashedPassword)

    const user = await users.findOne({ username: req.body.username });
  
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      return res.redirect('/menu?user=' + encodeURIComponent(user.username));
    }
    res.render('login.ejs',{ error: "Username or password is incorrect" });
  
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Route for historical data
app.get('/historical', async (req, res) => {
  connection = await mongoConnect();
  db = connection.db("GHMS");
  histsensors = db.collection('History');
  documents = await histsensors.find({}).toArray();
  response_json = JSON.stringify(documents);
  console.log(documents)
  return res.render("historical.ejs", {histsensors:documents});  
});

// Render login page with sensor data
app.get('/login', async (req, res) => {
  connection = await mongoConnect();
  db = connection.db("GHMS");
  sensors = db.collection('Sensors');
  documents = await sensors.find({}).toArray();
  response_json = JSON.stringify(documents);
  console.log(documents)
  return res.render("login.ejs", {sensors:documents}); 
});

// Route for environmental selection
app.get('/envselect', async (req, res) => {
  connection = await mongoConnect();
  db = connection.db("GHMS");
  sensors = db.collection('Sensors');
  documents = await sensors.find({}).toArray();
  response_json = JSON.stringify(documents);
  console.log(documents)
  return res.render("envselect.ejs", {sensors:documents}); 
});

// Route for user's greenhouse
//app.get('/yourgreenhouse', async (req, res) => {
 // connection = await mongoConnect();
 // db = connection.db("GHMS");
 // sensors = db.collection('Sensors');
 // documents = await sensors.find({}).toArray();
 // response_json = JSON.stringify(documents);
 // console.log(documents)
 // return res.render("yourgreenhouse.ejs", {sensors:documents}); 
//});

// Route for changing greenhouse
app.get('/changegreenhouse', async (req, res) => {
  connection = await mongoConnect();
  db = connection.db("GHMS");
  sensors = db.collection('Sensors');
  documents = await sensors.find({}).toArray();
  response_json = JSON.stringify(documents);
  console.log(documents)
  return res.render("changegreenhouse.ejs", {sensors:documents}); 
});

// Route for greenhouse data
app.get('/greenhouse', async (req, res) => {
  connection = await mongoConnect();
  db = connection.db("GHMS");
  sensors = db.collection('Sensors');
  documents = await sensors.find({}).toArray();
  response_json = JSON.stringify(documents);
  return res.render("greenhouse.ejs", {sensors:documents}); // *change to login.ejs as this is the first page!*
});

// Route to get sensor data
app.get('/getsensordata', async (req, res) => {
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
    connection = await mongoConnect();
    db = connection.db("GHMS");
    actuators = db.collection('Actuators');
    documents = await actuators.find({}).toArray();
    res.setHeader('Content-Type', 'application/json');
    return res.json(documents);
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error retrieving actuator states:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/getplantprofile', async (req, res) => {
  connection = await mongoConnect();
  db = connection.db("GHMS");
  profile = db.collection('PlantProfiles');
  documents = await profile.find({}).toArray();
  res.setHeader('Content-Type', 'application/json');
  return res.json(documents);
});

app.get('/getactuators', async (req, res) => {
  connection = await mongoConnect();
  db = connection.db("GHMS");
  profile = db.collection('Actuators');
  documents = await profile.find({}).toArray();
  res.setHeader('Content-Type', 'application/json');
  return res.json(documents);
});

// Route to update actuators
// Route to update actuators
// Route to update actuators
const { MongoClient, ObjectId } = require('mongodb');

// Update actuators route - THIS CODE UPDATES THE ACTUATORS
// app.post('/updateactuators', async (req, res) => {
//   // Assuming req.body contains the data to update
//   const newData = req.body;

//   try {
//     // Connect to the MongoDB database
//     const connection = await mongoConnect();
//     const db = connection.db("GHMS");
//     const profile = db.collection('Actuators');

//     // Update the data in the database
//     await profile.updateMany({}, { $set: newData });

//     // Fetch the updated data from the database
//     const updatedData = await profile.find({}).toArray();

//     // Respond with the updated data
//     res.setHeader('Content-Type', 'application/json');
//     return res.json(updatedData);
//   } catch (error) {
//     // Handle errors
//     console.error("Error updating data:", error);
//     res.status(500).json({ error: "Error updating data" });
//   }
// });

app.post('/updateactuator/:actuatorName', async (req, res) => {
  try {
    const { actuatorName } = req.params;
    const newData = req.body;

    // Connect to the MongoDB database
    const connection = await mongoConnect();
    const db = connection.db("GHMS");
    const profile = db.collection('Actuators');

    // Update the specific actuator's data in the database
    await profile.updateOne({ actuator_name: actuatorName }, { $set: newData });

    // Fetch the updated data from the database
    const updatedData = await profile.findOne({ actuator_name: actuatorName });

    // Respond with the updated data
    res.setHeader('Content-Type', 'application/json');
    return res.json(updatedData);
  } catch (error) {
    // Handle errors
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Error updating data" });
  }
});

// Route for menu
app.get('/menu',(req, res) => {
  let user = req.query.user;
  return res.render("menu.ejs", {user});
});

// Route for Settings
app.get('/settings', (req, res) => {
  res.render('settings');
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
