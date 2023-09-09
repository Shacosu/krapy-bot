require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const url = process.env.DB_URI;
const client = new MongoClient(url);
client.connect(function(err) {
	console.log('Connected successfully to server');
});
module.exports = client;