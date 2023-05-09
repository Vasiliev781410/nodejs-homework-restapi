const {BusinessProcess} = require('../models/business-process');
const {BusinessProcessCatalog} = require('../models/business-process-catalog');
const {HttpError} = require('../helpers');
const {ctrlWrapper} = require('../utils');

const listBp =   async (req, res, next) => {
    const {_id: owner} = req.user;            
  
    const result = await BusinessProcess.find({owner},"-owner").populate("owner", "email subscription");
    res.json(result); 
}

const getBpByName =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    const {name} = req.params;  
    const result = await BusinessProcess.findOne({name, owner});
    if (!result){ 
        throw HttpError(404,`Business-process with name ${name} not found`);      
    }    
    res.json(result);  
}

const addBp =   async (req, res, next) => {
    const {_id: owner} = req.user;    
    const result = await BusinessProcess.create({...req.body, owner});
        
    res.status(201).json(result);
}

const removeBp =  async (req, res, next) => {
    const {name} = req.params;
      
    const result = await BusinessProcess.findOneAndDelete({name});
    if (!result){ 
      throw HttpError(404,`Business-process with name ${name} not found`);      
    }    
    res.status(204).send(); 
}

const updateBp =   async (req, res, next) => {   
    const {name} = req.params;
  
    const result = await BusinessProcess.findOneAndUpdate({name},req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Business-process with name ${name} not found`);      
    }

    // const {_id: owner} = req.user;
    // const filter = {owner}; 
    // const catalogRes = await BusinessProcessCatalog.findOneAndUpdate(filter,catalog);   
    res.json(result);
}

module.exports = {
    listBp: ctrlWrapper(listBp),
    getBpByName: ctrlWrapper(getBpByName),
    addBp: ctrlWrapper(addBp),
    removeBp: ctrlWrapper(removeBp),
    updateBp: ctrlWrapper(updateBp),
};