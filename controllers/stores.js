const {Stores} = require('../models/stores');
const {ctrlWrapper} = require('../utils');

const getList =   async (req, res, next) => {
    const {_id: owner} = req.user;            
  
    const result = await Stores.find({owner},"-owner").populate("owner", "email subscription");
    res.json(result); 
}

const add =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    const {name} = req.body;
    const elem = await Stores.findOne({name});
    let result = null;
    if (!elem){   
        result = await Stores.create({...req.body, owner});
    }
        
    res.status(201).json(result);
}



module.exports = {
    getList: ctrlWrapper(getList),
    add: ctrlWrapper(add),
};