const {Subjects} = require('../models/subjects');
const {HttpError} = require('../helpers');
const {ctrlWrapper} = require('../utils');

const listSubjects =   async (req, res, next) => {
    const {_id: owner} = req.user;            
  
    const result = await Subjects.find({owner},"-owner").populate("owner", "email subscription");
    res.json(result); 
}

const getSubjectById =   async (req, res, next) => {
    const {id} = req.params;  
    const result = await Subjects.findOne({frontId: id});
    if (!result){ 
        throw HttpError(404,`Subject with id ${id} not found`);      
    }    
    res.json(result);  
}

const addSubject =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    const {name} = req.body;
    const elem = await Subjects.findOne({name});
    let result = null;
    if (!elem){   
        result = await Subjects.create({...req.body, owner});
    }
        
    res.status(201).json(result);
}

const removeSubject =  async (req, res, next) => {
    const {id} = req.params;
    console.log("id ",id);  
    const result = await Subjects.findByIdAndDelete({frontId: id});
    if (!result){ 
      throw HttpError(404,`Subject with id ${id} not found`);      
    }    
    res.status(204).send(); 
}

const updateSubject =   async (req, res, next) => {   
    const {id} = req.params;
    console.log(req.body);
  
    const result = await Subjects.findOneAndUpdate({frontId: id}, req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Subject with id ${id} not found`);      
    }

    // const {_id: owner} = req.user;
    // const filter = {owner}; 
    // const catalogRes = await BusinessProcessCatalog.findOneAndUpdate(filter,catalog);   
    res.json(result);
}

module.exports = {
    listSubjects: ctrlWrapper(listSubjects),
    getSubjectById: ctrlWrapper(getSubjectById),
    addSubject: ctrlWrapper(addSubject),
    removeSubject: ctrlWrapper(removeSubject),
    updateSubject: ctrlWrapper(updateSubject),
};