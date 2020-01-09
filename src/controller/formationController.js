
var FormationModel = require('../models/formation');


    var fillCombo = async ()=> {
     
        let array = [];
        let formations = await FormationModel
                        .find()
                        .select('nom');
        formations.forEach((doc, err) => {
            array.push(doc);
        });    
        return array;
    }

module.exports = { fillCombo : fillCombo}
 