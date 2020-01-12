let mongoose = require('mongoose')
let connection = require('../database')
let validator = require('validator');

let etudiantSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    image:{ data: String, contentType: String },
    CNI:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    dateNaissance : Date,
    tel: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
          return validator.isEmail(value)
        }
    },
    ville: String,
    pays: String,
    adresse : String,
    filiere:   {type: mongoose.Schema.Types.ObjectId, ref: 'Filiere'},
    createdAt: Date,
    updatedAt: Date
})
etudiantSchema.pre('save', function (next) {
    let now = Date.now()
     
    this.updatedAt = now
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
      this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next()    
  })
module.exports = etudiantSchema;


var etudiant = connection.model('Etudiant', etudiantSchema);
module.exports = etudiant;
