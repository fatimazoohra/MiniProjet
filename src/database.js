
let mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://127.0.0.1:27017/ESTE', {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = connection;


/*
const MongoClient = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(!err){ 
        console.log('mongoDB connection succeedded. ') 
    }
    else{ 
        console.log('error in DB connection . ') 
    }
});*/
