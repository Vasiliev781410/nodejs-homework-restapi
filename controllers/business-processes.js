const {BusinessProcess} = require('../models/business-process');
const {HttpError} = require('../helpers');
const {ctrlWrapper} = require('../utils');

const listBp =   async (req, res, next) => {
    const {_id: owner} = req.user;            
  
    const result = await BusinessProcess.find({owner},"-owner").populate("owner", "email subscription");
    res.json(result); 
}

const getBpByFrontId =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    const {frontId} = req.params;  
    const result = await BusinessProcess.findOne({frontId, owner});
    if (!result){ 
        throw HttpError(404,`Business-process with frontId ${frontId} not found`);      
    }    
    res.json(result);  
}

const addBp =   async (req, res, next) => {
    const {_id: owner} = req.user;    
    const result = await BusinessProcess.create({...req.body, owner});
        
    res.status(201).json(result);
}

const removeBp =  async (req, res, next) => {
    const {frontId} = req.params;
    console.log("frontId ",frontId);  
    const result = await BusinessProcess.findOneAndDelete({frontId});
    if (!result){ 
      throw HttpError(404,`Business-process with frontId ${frontId} not found`);      
    }    
    res.status(204).send(); 
}

const updateBp =   async (req, res, next) => {   
    const {frontId} = req.params;
    console.log(req.body);
  
    const result = await BusinessProcess.findOneAndUpdate({frontId},req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Business-process with frontId ${frontId} not found`);      
    }

    // const {_id: owner} = req.user;
    // const filter = {owner}; 
    // const catalogRes = await BusinessProcessCatalog.findOneAndUpdate(filter,catalog);   
    res.json(result);
}

module.exports = {
    listBp: ctrlWrapper(listBp),
    getBpByFrontId: ctrlWrapper(getBpByFrontId),
    addBp: ctrlWrapper(addBp),
    removeBp: ctrlWrapper(removeBp),
    updateBp: ctrlWrapper(updateBp),
};