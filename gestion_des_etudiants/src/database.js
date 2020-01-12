
let mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb+srv://este:estepassword@miniprojetweb-aaxas.mongodb.net/ESTEAtlas', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
module.exports = connection;
//mongodb://localhost:27017/ESTEM
// miniprojetweb-shard-00-00-aaxas.mongodb.net:27017
//mongodb+srv://este:estepassword@miniprojetweb-aaxas.mongodb.net/ESTEAtlas?retryWrites=true&w=majority
