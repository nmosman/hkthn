var Particle = require('particle-api-js');
var particle = new Particle();
var token = '68f46810c9f5b700182b80c96f844495747d561a';
var deviceID = '400053000f51353433323633';
const express = require('express')
const request = require('request')
const app = express()
var bodyParser = require('body-parser');

app.use(bodyParser());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(bodyParser.json());
/*
const db = require('./config/db');
const MongoClient = require('mongodb').MongoClient;

const MONGO_URL = 'mongodb://nmosman:apple123@ds239988.mlab.com:39988/hacks';

MongoClient.connect(MONGO_URL, (err, db) => {  
  if (err) {
    return console.log(err);
  }

  // Do something with db here, like inserting a record
  db.collection('data').insertOne(
    {
      title: 'Hello MongoDB',
      text: 'Hopefully this works!'
    },
    function (err, res) {
      if (err) {
        db.close();
        return console.log(err);
      }
      // Success
      db.close();
    }
  )
});

*/

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
 
var cloud = true;
 
var mongodbHost = '127.0.0.1';
var mongodbPort = '27017';
var dataCollection;
var db;
var authenticate ='';
//cloud
if (cloud) {
 mongodbHost = 'ds239988.mlab.com';
 mongodbPort = '39988';
 authenticate = 'nmosman:apple123@'
}
 
var mongodbDatabase = 'hacks';
 
// connect string for mongodb server running locally, connecting to a database called test
var url = 'mongodb://'+authenticate+mongodbHost+':'+mongodbPort + '/' + mongodbDatabase;
 
 
// find and CRUD: http://mongodb.github.io/node-mongodb-native/2.0/tutorials/crud_operations/
// aggregation: http://mongodb.github.io/node-mongodb-native/2.0/tutorials/aggregation/
 
MongoClient.connect(url, function(err, database) {   assert.equal(null, err);
   console.log("Connected correctly to server.");
   db = database.db('hacks');
   dataCollection = db.collection('data');
//var cursor = collection.find({});
    // find top 20 countries by  size
   // db.collection('countries').find({},{"sort": [["area",-1]]}).limit(20).toArray(function(err, results){
    });
 

const options = {
		url: 'https://api.particle.io/v1/devices',
		method: 'GET',
		headers: {
		'Authentication':  'Bearer 68f46810c9f5b700182b80c96f844495747d561a'
}
		};

app.get('/getHeartData', (req, res) => {
  res.send(JSON.stringify({hBeat:"55", o2 : "0.9", temp : "23.1"}))
})


app.post('/updateData', (req, res) => {

 dataCollection.insertOne(req.body, function(err, res) {
    if (err) throw err;
    console.log(req.body);
    console.log("1 document inserted");
    //db.close();
  });
 res.send("updated");
})

app.get('/getData', (req, res) => {
//    var fp = particle.callFunction({deviceId: deviceID, name: "getIR", arg: "blah",  auth:token});
  //  fp.then( function(data){
//res.send(data);
//}, function(err) {
//res.send(err);
//}
//);
/*
MongoClient.connect(url, function(err, db) {   assert.equal(null, err);
   console.log("Connected correctly to server.");

   db.collection("data").findOne({}, function(err, result) {
    if (err) throw err;
    res.send(result);
    //db.close();
  });*/
//var cursor = collection.find({});
    // find top 20 countries by  size
   // db.collection('countries').find({},{"sort": [["area",-1]]}).limit(20).toArray(function(err, results){
    dataCollection.find({}).limit(1).sort({ $natural : -1 }).toArray(function(err, category) {  

///onsole.log('hey');
console.log(category);
res.send(category);
});
})
app.get('/getSPO2', (req, res) => {
	
	var devicePr = particle.getDevice({ deviceId: deviceID, auth: token});
	
	devicePr.then(
	function(data){
	res.send(data);
}, function(err) {
	console.log('sfsdfdsfasfd', err);
}
);
	//res.send(JSON.stringify({'reading' : 45}));
})

app.get('/getTemperature', (req, res) => {
	var fnPr = particle.callFunction({deviceId: deviceID, name: "test", argument: "blah", auth: token});

        fnPr.then(
function(data)
{
	res.send(data);
}, function(err)
{
	res.send(err);
}
);
	//res.send(JSON.stringify({"reading": 20}));
})
app.listen(3000, () => console.log('Server running on port 3000'))


