const {getModel} = require('../models/finances');
const {ctrlWrapper} = require('../utils');



const getList =   async (req, res, next) => {
    const {_id: owner} = req.user;
       
    const Subjects = getModel( req.body.organization);
    // console.log('Subjects ',Subjects); 

    const result = await Subjects.find({owner},"-owner").populate("owner", "email subscription");
    result.sort((a, b) => a.path > b.path ? 1 : -1);

    console.log('result ',result); 
    res.json(result); 
}

const add =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    console.log("req.params: ",req.params);
  
    const Subjects = getModel( req.body.organization);
    const {name} = req.body;
    const elem = await Subjects.findOne({name});
    let result = null;
    if (!elem){   
        result = await Subjects.create({...req.body, owner});
    }   
           
    res.status(201).json(result);
}


module.exports = {
    getList: ctrlWrapper(getList),
    add: ctrlWrapper(add), 
};