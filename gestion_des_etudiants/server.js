//https://vegibit.com/mongoose-relationships-tutorial/
//https://stackoverflow.com/questions/48933611/mongoose-saving-ref-of-another-document-into-an-array-of-objects-document-retur
//variables
let express = require('express')
let app = express()
let bodyParser = require('body-parser')
//


var fs = require('fs');
var multer = require('multer');
app.set('view engine', 'ejs')
//middlewares
app.use('/assets',express.static('public'))
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())
//app.use(require('./middlewares/flash'))
var functions = require('./src/controller/formationController');
var upload = multer({ dest: './public/uploads/images' })
//models
let FormationModel = require('./src/models/formation')
let FiliereModel = require('./src/models/filiere')
let EtudiantModel = require('./src/models/etudiant')
let Usermodel = require('./src/models/user')

//get_routes
//1
app.get('/filieres_list',async(request, response) => {
    let array = [] ;
    let array1 = [] ;
    let filieres = await FiliereModel.find().populate('formation');
    filieres.forEach((filiere, err) => {
        array.push(filiere);
        array1.push(filiere.formation);
    });
    console.log(array1);
    response.render('pages/filieres_list', {filieres:array, formations:array1})
});
//2
app.get('/etudiants_list', async(request, response) => {
    var array = [];
    var etudiants = await EtudiantModel.find();
    etudiants.forEach((etudiant, err)=>{
        array.push(etudiant);
    });

    response.render('pages/etudiants_list', {etudiants:array})
});
//3
app.get('/delete_filiere/:id', async(request, response)=>{
    await FiliereModel.deleteOne({
                            _id:request.params.id
                        }, function(err, filiere){
                            if(err) throw err;

                            console.log('supprimé');
                        });
    response.redirect('/filieres_list')
})
//4
app.get('/ajouter_etudiant',async (request, response) => {
    let array = [] ;
    let array1 = [];

    let formations = await FormationModel
                        .find();
    formations.forEach((formation, err) => {
        array.push(formation);
    });
   
    
       
        let filieres = await FiliereModel
        .find();
        filieres.forEach((filiere, err) => {
        array1.push(filiere);
        });
      //let filieres = getFilieres=async()=>{
            // return array1;
     //}
    response.render('pages/ajouter_etudiant',{formations:array, filieres:array1})
});
//5
app.get('/ajouter_filiere', async(request, response) => {
    let array = [] ;
    let formations = await FormationModel
                        .find();
    formations.forEach((formation, err) => {
        array.push(formation);
    });
    let User = new Usermodel({
        email:"admin@gmail.com",
        password:"password"
    });
    User.save()
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    });
    console.log(User);
    response.render('pages/ajouter_filiere', {formations:array});
});
//post_routes
//1
app.post('/filiere_modify/:id', async(request, response)=>{
    await FiliereModel.replaceOne({_id:request.params.id},{
        nom: request.body.nom,
        description: request.body.description
    });
    response.redirect('/filieres_list')
})
//2
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
   

    let etudiant = new EtudiantModel({
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
            data: file.filename,
            contentType: 'image/jpg'
        },
        filiere: request.body.filiere
    });
    etudiant.save()
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    }); 
    console.log(etudiant);
    response.redirect('/etudiants_list')

    
})
//3
app.post('/add_filiere',async (request, response) => {
    let filiere = new FiliereModel({
        nom: request.body.nom,
        description: request.body.description,
        formation:request.body.formation
    });
    filiere.save()
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    });
    
    response.redirect('/filieres_list')
});

app.get('/etudiant_infos/:id',async (request, response) => {
    let etudiant = await EtudiantModel.findOne({_id:request.params.id})
                                      .populate('filiere')
                                      .populate('formation');      
    response.render('pages/etudiant_infos', {etudiant:etudiant, filiere:etudiant.filiere["nom"]})
});

app.get('/etudiants_list/etudiant_delete/:id', async(request, response)=>{
    await EtudiantModel.deleteOne({
                            _id:request.params.id
                        }, function(err, etudiant){
                            if(err) throw err;

                            console.log('supprimé');
                        });
    response.redirect('/etudiants_list')
})
app.get('/etudiant_edit/:id', async(request, response)=>{
    var etudiant = await EtudiantModel.findOne({_id:request.params.id})
                                      .populate('filiere');
    var filieres = await FiliereModel.find();
    response.render('pages/modifier_etudiant',{etudiant:etudiant, filieres:filieres})
});

app.post('/etudiant_edit/editer_etudiant/:id',upload.single('image') ,  async(request, response)=>{
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/images')
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now())
        }
      });
      var upload = multer({ storage: storage })
      const file = request.file
      if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
      }
    await EtudiantModel.replaceOne({_id:request.params.id},{
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
            data: file.filename,
            contentType: 'image/jpg'
        },
        filiere: request.body.filiere
    });
    response.redirect('/etudiants_list')
});

app.get('/', (request, response) => {
    response.render('pages/login')
});
app.get('/statistics', (request, response) => {
    response.render('pages/statistics')
});
    app.post("/login_btn", function(req, res) {
        const email = req.body.email;
        const password = req.body.password;
      
        try {
          Usermodel.findOne({
                email: email
            }, function(err, foundUser) {
                if (err || !foundUser) {
                    return res.redirect("/login?err=Email n'existe pas !");
                }
                if (foundUser.password !== password) {
                    // you can use  bcryptjs for hashing and comparing hashed values.
      
                    return res.redirect("/login?err=Email ou Mot de passe incorrect");
                }
                res.redirect("/etudiants_list");
            });
        } catch (error) {
           res.redirect("/login?err=something went wrong!");
        }
      });
app.listen(3000);

//mongoatlass

//1979