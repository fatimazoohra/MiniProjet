//https://vegibit.com/mongoose-relationships-tutorial/
//https://stackoverflow.com/questions/48933611/mongoose-saving-ref-of-another-document-into-an-array-of-objects-document-retur
//variables
let express = require('express')
let app = express()
let bodyParser = require('body-parser')
//


var fs = require('fs');
var multer = require('multer');
//let url = 'mongodb://localhost:27017/GEtudiantsDB';
//let MongoClient = require('mongodb').MongoClient

//mongodb://127.0.0.1:27017/start?compressors=disabled&gss
//moteur de template
//app.engine('ejs', require('ejs-locals'));//layout partial block

//var expressLayouts = require('express-ejs-layouts');
//app.use(expressLayouts);
app.set('view engine', 'ejs')
//middlewares
app.use('/assets',express.static('public'))
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())
//app.use(require('./middlewares/flash'))
var functions = require('./src/controller/formationController');


var upload = multer({ dest: './public/uploads/images' })
let FormationModel = require('./src/models/formation')



//routes
app.get('/',async (request, response) => {
    let array = [] ;
    let formations = await FormationModel
                        .find()
                        .select('nom');
    formations.forEach((formation, err) => {
        array.push(formation);
    });
    //console.log(array);
    /*var xx = functions.fillCombo();
    xx.then(function(result) {
        console.log(result)
     })*/


     let array1 = [] ;
     //getFilieres=()=>{
        //formation_id = document.getElementById('id_select').value;
        //document.getElementById('demo').innerHTML = "you selected";
        //formation_id = value;
        let formation =  FormationModel.findOne({nom: 'masterr'})
         .select('filieres');
        
        formation.filieres.forEach((filiere, err) => {
            array1.push(filiere);
        });
   // }
    response.render('pages/index',{formations:array, filieres:array1})
});

app.get('/ajouter_filiere', async(request, response) => {
    let array = [] ;
    let formations = await FormationModel
                        .find();
    formations.forEach((formation, err) => {
        array.push(formation);
    });
    response.render('pages/ajouter_filiere', {formations:array});
});
app.post('/add_filiere',async (request, response) => {
    let connection = require('./src/database');
    
    let filiere1 = require('./src/models/Filiere')
    let FiliereModel = connection.model('Filiere', filiere1);

    let filiere = new FiliereModel({
        nom: request.body.nom,
        description: request.body.description
    })
    let formation = new FormationModel({
        nom: request.body.formation+"1",
        filieres: filiere
    })
    formation.save()
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    }) 
    let array = [] ;
    let formations = await FormationModel
                        .find();
    formations.forEach((formation, err) => {
        array.push(formation);
    }); 
    response.render('pages/ajouter_filiere', {formations:array});
});
app.post('/add_etudiant', upload.single('image') /*,upload.single('image') */, (request, response, next) => {

    // SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images')
    },
    //use_filename: true,
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })
  const file = request.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
   

    let connection = require('./src/database');
    
    let filiere = require('./src/models/Filiere')
    let FiliereModel = connection.model('Filiere', filiere);
    let etudiant = require('./src/models/etudiant')
    let EtudiantModel = connection.model('Etudiant', etudiant);
    //console.log(request.files.path);

    let etudiant1 = new EtudiantModel({
        nom: request.body.nom,
        prenom: request.body.prenom,
        CNI: request.body.cin,
        dateNaissance : request.body.date_naissance,
        tel:request.body.tel ,
        email: request.body.email,
        ville: request.body.ville,
        pays: request.body.pays,
        adresse : request.body.adresse,
        image:  {
            //'C:/Users/21267/Pictures/IMG_20190619_222428'
            data: fs.readFileSync(file.path),
            contentType: 'image/png'
        }
    })
    let filiere1 = new FiliereModel({
        nom: 'GBI',
        etudiants: etudiant1
    })
    let formation = new FormationModel({
        nom: "DUT",
        filieres: filiere1
    })
    formation.save()
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    })  
    console.log(formation);
    // response.render('pages/index')
    response.send(file.path)
    //console.log(request.session.flash)
    /*MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, database)=>{
        if(err) throw err;
        let etudiants = [];
        const mydb = database.db('GEtudiantsDB');
        let cursor = mydb.collection('etudiant').find()
        
        cursor.forEach(function(err, doc){
            if(err){console.log(err)}
            else{
                employees.push(doc);
            }
        });
        console.log(etudiants);
        response.render('pages/index', {etudiants : etudiants})
    }); */

    
})

/*

app.post('/', (request,response) => {
    let msg = request.body.message;
    if( msg ==='' || msg === undefined){
        request.flash('error', 'can you write the message first :)')
        response.redirect('/')
    } 
    else{
        request.flash('great', 'this is great:)')
        response.redirect('/')
    }
})
*/

/*

app.post('/insert', (req, res, next)=>{
    var message = req.body.message
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, database)=>{
        if(err) throw err;
        const mydb = database.db('GEtudiantsDB');
        console.log("Switched to "+mydb.databaseName+" database");

        var docs = [{ id:12, name: message, age: "21" }];
        
        mydb.collection("etudiant").insertMany(docs, function(err, res) {
            if (err) throw err;
            console.log(res.insertedCount+" etudiant inserted");
            database.close();
        });
    }); 
    res.redirect('/')           
});

app.get('/list', (request, response) => {   
})*/

app.listen(3000)

