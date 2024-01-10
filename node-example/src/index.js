const express = require('express')
const app = express()
let nunjucks = require('nunjucks')
const port = 3000
const path = require('path')
const bodyParser = require("body-parser");

app.use(express.json())
app.set('view engine', 'ejs');

nunjucks.configure(['views/'], {
  autoescape: true,
  express: app
})

/////////Setting up Mongo//////////
async function mongoConnect(){
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb+srv://<username>:<password>@cluster0.v5chlrq.mongodb.net/?retryWrites=true&w=majority";

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
  db = connection.db("example-database");
  collection = db.collection('example-collection');
  documents = await collection.find({}).toArray();
  response_json = JSON.stringify(documents)

  res.render('index.ejs', {users: documents});
})







//sendFile function to send a static HTML page 
app.get('/home', async (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/login', async (req, res) => {
  res.sendFile(path.join(__dirname, '/login.html'));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
////////////////////////////////////