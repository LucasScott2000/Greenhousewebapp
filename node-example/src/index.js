

let nunjucks = require('nunjucks')
const port = 3000
const path = require('path')
const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = 
        require("passport-local-mongoose")
const app = express()
const User = require("../model/User");
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

nunjucks.configure(['views/'], {
  autoescape: true,
  express: app
})

/////////Setting up Mongo//////////
async function mongoConnect(){
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb+srv://lscott:mongodb123@clusterghms.mqurwz8.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  return await client.connect()
}
////////////////////////////////


////////Express Application/////////
app.get('/', async (req, res) => {
  
  res.render('login.ejs');
})







//sendFile function to send a static HTML page 
app.get('/home', async (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));


})

app.get('/login', async (req, res) => {
  res.render('login.ejs');
})

app.post('/login', async function(req, res){
  try {
      // check if the user exists
      connection = await mongoConnect();
      db = connection.db("GHMS");
      users = db.collection('Users');
      documents = await users.find({}).toArray();
      response_json = JSON.stringify(documents);
    
      const user = await users.findOne({ username: req.body.username });
    
      //console.log(user);
      if (user  &&  req.body.password === user.password) {
        //check if password matches
        
        
        return res.redirect('/menu?user=' + encodeURIComponent(user.username));
        
      }
      res.render('login.ejs',{ error: "Username or password is incorrect" });
    
    } catch (error) {
      res.status(400).json({ error });
    }
});


app.get('/greenhouse', async (req, res) => {
  connection = await mongoConnect();
  db = connection.db("GHMS");
  sensors = db.collection('Sensors');
  documents = await sensors.find({}).toArray();
  response_json = JSON.stringify(documents);
  console.log(documents)
  return res.render("greenhouse.ejs", {sensors:documents});
        
})

app.get('/menu',(req, res) => {
  let user = req.query.user;
  return res.render("menu.ejs", {user});
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
////////////////////////////////////