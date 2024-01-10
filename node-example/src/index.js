

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
  connection = await mongoConnect();
  db = connection.db("GHMS");
  collection = db.collection('Users');
  documents = await collection.find({}).toArray();
  response_json = JSON.stringify(documents)
  console.log(documents);
  res.render('index.ejs', {users: documents});
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
      collection = db.collection('Users');
      documents = await collection.find({}).toArray();
      response_json = JSON.stringify(documents);
      
      

      const user = await collection.findOne({ username: req.body.username });
    
      //console.log(user);
      if (user) {
        //check if password matches
        if (req.body.password === user.password) {
          return res.render("secret");
        } 
      }
      res.render('login.ejs',{ error: "Username or password is incorrect" });
    
    } catch (error) {
      res.status(400).json({ error });
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
////////////////////////////////////