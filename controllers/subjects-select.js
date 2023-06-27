const {getSubjectModel} = require('../models/subjects-select');
const {HttpError} = require('../helpers');
const {ctrlWrapper} = require('../utils');

const getReqParams =   (req) => {
    const{subject} = req.params;
   
    const indexOfFirst = subject.indexOf("+");
    let _id = null; 
    let subjectName = subject;
    if (indexOfFirst !== -1){
        subjectName = subject.substring(1, indexOfFirst-1);
        _id = subject.substring(indexOfFirst+1);
    }
    
    return {subjectName, _id};
}

const listSubjects =   async (req, res, next) => {
    const {_id: owner} = req.user;

    console.log('req.params ',req.params);            
   
    const {subjectName} = getReqParams(req);
    const Subjects = getSubjectModel(subjectName);

    const result = await Subjects.find({owner},"-owner").populate("owner", "email subscription");
    res.json(result); 
}

const addSubject =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    console.log("req.params: ",req.params);
    const {subjectName} = getReqParams(req);
    const Subjects = getSubjectModel(subjectName);   
    const result = await Subjects.create({...req.body, owner});
        
    res.status(201).json(result);
}

const removeSubject =  async (req, res, next) => {    
    const {subjectName, _id} = getReqParams(req);
    const Subjects = getSubjectModel(subjectName);
    const result = await Subjects.findByIdAndDelete(_id);
    if (!result){ 
      throw HttpError(404,`Subject with id ${_id} not found`);      
    }    
    res.status(204).send(); 
}

const updateSubject =   async (req, res, next) => {         
    const {subjectName, _id} = getReqParams(req);
    const Subjects = getSubjectModel(subjectName);
    const result = await Subjects.findByIdAndUpdate(_id, req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Subject with id ${_id} not found`);      
    } 
    res.json(result);
}

module.exports = {
    listSubjects: ctrlWrapper(listSubjects),
    addSubject: ctrlWrapper(addSubject),
    removeSubject: ctrlWrapper(removeSubject),
    updateSubject: ctrlWrapper(updateSubject),
};