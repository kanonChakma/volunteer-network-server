const express = require('express')
const app = express()
const cors=require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()


const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ynfam.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json())

const port=5000

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteerData").collection("volunteerInfo");
  app.get('/getData',(req,res) => {
   collection.find({})
   .toArray((err,documents)=>{
     res.send(documents)
    })
  })
  app.get('/addImage',(req,res)=>{
    collection.find({title:req.query.title})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })
  app.post('/adminInsert',(req,res) => {
    const event=req.body;
   collection.insertOne(event)
   .then(result=>{
    res.send(result.insertedCount>0)
   })
})
});
client.connect(err =>{
  const collection = client.db("volunteerData").collection("volunteerDetails");
  app.post('/addData',(req,res) => {
    const event=req.body;
   collection.insertOne(event)
   .then(result=>{
    res.send(result.insertedCount>0)
   })
})
app.get('/getAllEvent',(req,res) => {
  collection.find({})
  .toArray((err,documents)=>{
    res.send(documents)
   })
 })
app.get('/getEvent',(req,res)=>{
  collection.find({email:req.query.email})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})
app.delete('/deleteEvent/:id',(req,res)=>{
  console.log(req.params.id)
  collection.deleteOne({_id:ObjectId(req.params.id)})
  .then(result=>{
    res.send(result.deletedCount>0)
  })
})
});
app.get('/', (req, res) => {
  res.send('database is working')
})
app.listen(process.env.PORT || port)