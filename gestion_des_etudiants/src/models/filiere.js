let mongoose = require('mongoose')
let Schema = require('mongoose').Schema
let connection = require('../database');

let filiereSchema = new mongoose.Schema({
    nom: {
        type: String,
        //required: true,
        //unique: true,
        //lowercase: true
    },
    description: String,
    formation:  {type: mongoose.Schema.Types.ObjectId, ref: 'Formation'},
    createdAt: Date,
    updatedAt: Date
})
filiereSchema.pre('save', function (next) {
    let now = Date.now()
     
    this.updatedAt = now
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
      this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next()    
  })

var filiere = connection.model('Filiere', filiereSchema);
module.exports = filiere;
