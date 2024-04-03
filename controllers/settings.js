const {Counters} = require('../models/settings');
const {ctrlWrapper} = require('../utils');
const {HttpError} = require('../helpers');

const add =   async (req, res, next) => {
    const {_id: owner} = req.user;    
    const result = await Counters.create({...req.body, owner});
        
    res.status(201).json(result);
}

const getByName =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    const {id} = req.params;  
    const result = await Counters.findOne({sequence_name: id,owner});
    if (!result){ 
        throw HttpError(404,`Counter with name ${id} not found`);      
    }    
    res.json(result);  
}

const update =   async (req, res, next) => {   
    const {id} = req.params;
    const {_id: owner} = req.user; 
    console.log(req.body);
  
   
    const result = await Counters.findOneAndUpdate({sequence_name: id,owner},req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Counter with name ${id} not found`);      
    };

    res.json(result);
}



module.exports = { 
    add: ctrlWrapper(add),
    getByName: ctrlWrapper(getByName),
    update: ctrlWrapper(update),
};