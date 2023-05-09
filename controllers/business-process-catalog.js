const {BusinessProcessCatalog} = require('../models/business-process-catalog');
const {ctrlWrapper} = require('../utils');

const getCatalog =   async (req, res, next) => {
    const {_id: owner} = req.user;            
  
    const result = await BusinessProcessCatalog.find({owner},"-owner").populate("owner", "email subscription");
    res.json(result); 
}

const updateCatalog =   async (req, res, next) => {
    const {_id: owner} = req.user;  

    let result = await BusinessProcessCatalog.findOneAndUpdate({owner});
    if (!result){
        result = await BusinessProcessCatalog.create({...req.body, owner});
    };

    res.status(201).json(result);
}

module.exports = {
    getCatalog: ctrlWrapper(getCatalog),  
    updateCatalog: ctrlWrapper(updateCatalog),
};