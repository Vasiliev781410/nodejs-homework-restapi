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
    console.log('Subjects ',Subjects); 

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
    const elem = await Subjects.findOne({name,owner});
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

const updateSubjectParams =   async (req, res, next) => {         
    const {subjectName, id} = getReqParams(req);
    const Subjects = getSubjectModel(subjectName);
    console.log("req.body ", req.body);
    const result = await Subjects.findByIdAndUpdate(id, req.body, {new: true});
    // const result = await Subjects.findOneAndUpdate({frontId: id}, req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Subject with id ${id} not found`);      
    } 
    res.json(result);
}

const upload =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    const {data, organization} = req.body;
    const firstElement = data.shift();
    const {subjectName} = getReqParams(req);
    const Subjects = getSubjectModel(subjectName);
    console.log("subjectName: ",subjectName);
    // const Subjects = getModel("subject") || mongoose.models.subject;
    // const Subjects = mongoose.models.subject;
    // const Subjects = getModel("banki");

    // let Subjects = "";
    // console.log("mongoose.models ",mongoose.models);  
    console.log(firstElement);   
    for (const item of data){
        if (item.length > 0){
            if (item[3]){
                console.log("!!! item[3]: ",item[3]); 
                // const Subjects = mongoose.models[item[3]] || getModel(item[3]);
                const frontIdNewElem = item[1]; 

                const newElem = {name: item[0], path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source: item[3], parentId: item[2],organization};
                const elem = await Subjects.findOne({frontId: frontIdNewElem, source: item[3]}, owner);
                console.log("item[3]: ",item[3]);                
                
                let result = null;
                if (!elem){                    
                    result = await Subjects.create({...newElem, owner});
                    console.log("result: ",result);
                    res.status(201).json(result);
                }else{
                    console.log("elem: ",elem);
                    res.status(201);
                };                    
          
            };
        };
    };
}

module.exports = {
    listSubjects: ctrlWrapper(listSubjects),
    addSubject: ctrlWrapper(addSubject),
    removeSubject: ctrlWrapper(removeSubject),
    updateSubject: ctrlWrapper(updateSubject),
    updateSubjectParams: ctrlWrapper(updateSubjectParams),
    upload: ctrlWrapper(upload),
};