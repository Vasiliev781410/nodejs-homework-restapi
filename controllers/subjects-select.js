const {getSubjectModel} = require('../models/subjects-select');
const {HttpError} = require('../helpers');
const {ctrlWrapper} = require('../utils');

const getReqParams =   (req) => {
    const{subject} = req.params;
   
    const indexOfFirst = subject.indexOf("+");
    let id = null; 
    let subjectName = subject;
    if (indexOfFirst !== -1){
        subjectName = subject.substring(0, indexOfFirst);
        id = subject.substring(indexOfFirst+1);
    }
    
    return {subjectName, id};
}

const listSubjects =   async (req, res, next) => {
    const {_id: owner} = req.user;
       
   
    const {subjectName} = getReqParams(req);
    const Subjects = getSubjectModel(subjectName);
    // console.log('Subjects ',Subjects); 

    const result = await Subjects.find({owner},"-owner").populate("owner", "email subscription");
    result.sort((a, b) => a.path > b.path ? 1 : -1);

    console.log('result ',result); 
    res.json(result); 
}

const addSubject =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    console.log("req.params: ",req.params);
    const {subjectName} = getReqParams(req);
    const Subjects = getSubjectModel(subjectName);
    const {name} = req.body;
    const elem = await Subjects.findOne({name});
    let result = null;
    if (!elem){   
        result = await Subjects.create({...req.body, owner});
    }   
           
    res.status(201).json(result);
}

const removeSubject =  async (req, res, next) => {    
    const {subjectName, id} = getReqParams(req);
    const Subjects = getSubjectModel(subjectName);    
    console.log("removeSubject: ",Subjects);
    // const result = await Subjects.findOneAndDelete({frontId: id});
    const result = await Subjects.findByIdAndDelete(id);
    if (!result){ 
      throw HttpError(404,`Subject with id ${id} not found`);      
    }    
    res.status(204).send(); 
}

const updateSubject =   async (req, res, next) => {         
    const {subjectName, id} = getReqParams(req);
    const Subjects = getSubjectModel(subjectName);
    const result = await Subjects.findByIdAndUpdate(id, req.body, {new: true});
    // const result = await Subjects.findOneAndUpdate({frontId: id}, req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Subject with id ${id} not found`);      
    } 
    res.json(result);
}

module.exports = {
    listSubjects: ctrlWrapper(listSubjects),
    addSubject: ctrlWrapper(addSubject),
    removeSubject: ctrlWrapper(removeSubject),
    updateSubject: ctrlWrapper(updateSubject),
};