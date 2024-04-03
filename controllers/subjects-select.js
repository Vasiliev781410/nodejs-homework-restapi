const {getSubjectModel} = require('../models/subjects-select');
const {HttpError} = require('../helpers');
const {ctrlWrapper} = require('../utils');
const { v4: uuidv4 } = require('uuid');

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
};

const findParam = async (paramStr,owner) => {  
    const Parameters = getSubjectModel("parameter");
    const param = await Parameters.findOne({frontId: paramStr, owner});

    return param;
};

const convertIntoArray = async (formulaStr,owner) => {
    const params = [];
    const signs = ["+","-","*","/","(",")"]; 
    const numbers = ["0","1","2","3","4","5","6","7","8","9",","];
    // let currentFormula = formulaStr.repeat(0);
    let simbol = "";
    let type = "";
    let previousType = "";
    let previousValue = "";
    let value = "";
    let id = ""; 
    for (let i = 0; i < formulaStr.length; i++) {
        if (i === formulaStr.length-1){
            simbol = formulaStr.slice(i);
        }else{        
            simbol = formulaStr.slice(i,i+1);
        }; 
        // check if simbol signs         
        let elem = signs.find(item => item === simbol);
        if (elem){
            type = "sign";                     
        };
        if (!elem){
            elem = numbers.find(item => item === simbol);
            if (elem){
                type = "number";
            };            
        }; 
        if (!elem){ 
            type = "parameter";          
        }; 

        value = "";         

        // console.log("formula simbol ",simbol);     
        if (previousType === "number" & type !== "number"){
            id = uuidv4(); 
            params.push({id, paramId: "",paramName: previousValue, type: previousType}); 
        };
        if (previousType === "parameter" & type !== "parameter"){
            id = uuidv4(); 
            let paramName = previousValue;
            const param =  await findParam(previousValue,owner);            
            let paramId = "";
            if (param){
                paramId = param._id.toString();
                paramName = param.name;
            }
            params.push({id, paramId,paramName, type: previousType}); 
        }; 
        if (i === formulaStr.length-1){
            if (previousType !== type){
               value = simbol;  
            }else{
               value = previousValue.concat(simbol);
            };
            if (type === "number"){
                id = uuidv4(); 
                params.push({id, paramId: "",paramName: value, type});
                
                return params; 
            }else if (type === "parameter"){
                id = uuidv4(); 
                let paramName = value;
                const param =  await findParam(paramName,owner);            
                let paramId = "";                
                if (param){
                    paramId = param._id.toString();
                    paramName = param.name;
                }
                params.push({id, paramId, paramName, type}); 

                return params;     
            }; 
        };    
          
        if (type === "sign"){      
            value = simbol;
            id = uuidv4(); 
            params.push({id, paramId: "",paramName: value, type});                   
        };
        if ( type === "number"){         
            if (previousType === "number"){
                value = previousValue.concat(simbol);
            }else{
                value = simbol;  
            };                      
        };        
        // if not number and not sign
        if (type === "parameter"){ 
            if (previousType === "parameter"){
                value = previousValue.concat(simbol);
            }else{
                value = simbol;  
            };                
        }; 
       
        previousType = type;
        previousValue = value;
      }

    return params; 
};
const convertFormula = async (formulaStr,owner) => { 
    const formulaData = {variableId: "", variable: "", params: []};
    const formulaStrings = formulaStr.split("="); 
    if (formulaStrings.length > 0){        
        let counter = 1;
        for (const paramStr of formulaStrings){
            if (counter === 1){
                formulaData.variable = formulaStrings[0];
                const param =  await findParam(formulaData.variable,owner); 
                if (param){
                    formulaData.variableId = param._id.toString();
                };
            }else{
                formulaData.params = await convertIntoArray(paramStr,owner); 
                // console.log("formula param ",paramStr);            
            };
            counter += 1; 
        };  
    };
       
    return formulaData;
};


const formulas =   async (str,source,owner) => { 
    const formulaSequence = []; 
    const arrayFormulaStr = splitParams(str); 
    for (const formulaStr of arrayFormulaStr){
       // 1. convert formula into param array
       const formulaData = await convertFormula(formulaStr,owner); 
       const {variableId, variable, params} = formulaData;     
       formulaSequence.push({variableId, variable,formula: params});
    };
   
    return formulaSequence;
};

const splitParams =   (str) => {   
    const frontIds = str.split(", ");
    const frontIds1 = str.split(",");
    if (frontIds1.length > frontIds.length){
        return frontIds1;
    };   

    return frontIds;
};

const convertParamsToArray =   async (str,owner) => {
    const params = []; 
    const frontIds = splitParams(str);    
    for (const frontId of frontIds){
        let paramId = "";    
        const result = await findParam(frontId,owner);
        if (result){
            paramId = result._id.toString();
        // type 
            let typeParam = ""; 
            const param = result.params.find(item => item.name === "type");
            if (param){
                typeParam = param.value.type;
            }                                             
            // console.log("!!!!!! param: ",result); 
            params.push({name: result.name,  _id: paramId, value: {name: null,_id: null,type: typeParam}}); 
        };                         
    };

    return params;
};

const upload =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    const {data, organization} = req.body;
    const firstElement = data.shift();
    // const {subjectName} = getReqParams(req);     
    // console.log("subjectName: ",subjectName);
    // const Subjects = getModel("subject") || mongoose.models.subject;  
    console.log(firstElement); 
    const resArray = [];
    let sequence = []; 
    let currentOwnerBP = "";
    let currentFrontId = "";
    for (const item of data){
        if (item.length > 0){
            if (item[3]){
                if (item[4] || currentOwnerBP){ 
                    if (!currentOwnerBP){
                        currentOwnerBP = item[4];
                    };
                    let processId = ""; 
                    currentFrontId = item[1].trim();
                    const Process = getSubjectModel("process");
                    const result = await Process.findOne({frontId: currentFrontId, owner});
                    if (result){
                        processId = result._id.toString();
                        // console.log("!!!!!! process: ",result); 
                    }; 
                                     
                    if (item[4] !==currentOwnerBP){                       
                        const Subjects = getSubjectModel(item[3]);
                        await Subjects.findOneAndUpdate({frontId: currentOwnerBP, owner}, {sequence, source: item[3]},{new: true});
                        // console.log("!!!!!! update: ",update); 
                        currentOwnerBP = item[4];
                        sequence = []; 
                    };

                    sequence.push({name: item[0], _id: processId,  frontId: item[1], path: "".concat("/",item[1]), parentId: item[1], value: {name: item[0], _id: processId, type: "process"}});  
                }else{                   
                    // console.log("!!! item[3]: ",item[3]); 
                    const Subjects = getSubjectModel(item[3]);
                    currentFrontId = item[1].trim(); 

                    const newElem = {name: item[0], path: "/".concat(currentFrontId), frontId: currentFrontId, source: item[3], parentId: item[2],organization};
                    const elem = await Subjects.findOne({frontId: currentFrontId, source: item[3], owner});
                    // console.log("item[3]: ",item[3]);                
                    
                    let result = null;
                    if (!elem){                    
                        result = await Subjects.create({...newElem,owner},{new: true});
                        // console.log("result: ",result);
                        resArray.push(result);                                    
                    }else{
                        // console.log("elem: ",elem);             
                    };                   
                };
            };
        };
    };
    // fill other parameters which use previous parameters
    for (const item of data){
        if (item.length > 0){
            if (item[3]){                                
                if (item[5]){
                    const params = await convertParamsToArray (item[5],owner);      
                    const Subjects = getSubjectModel(item[3]);
                    // const resSubj = 
                    await Subjects.findOneAndUpdate({frontId: item[1], owner}, {params, source: item[3]},{new: true});                  
                    // console.log("!!!!!! resSubj: ",resSubj);
                };
                const typeParams = []; 
                if (item[6]){                                
                    let paramId = ""; 
                    // 1. find parameter "type"
                    const Parameters = getSubjectModel("parameter");
                    const result = await Parameters.findOne({frontId: "type", owner});
                    if (result){
                        paramId = result._id.toString();
                        console.log("!!!!!! param type: ",result); 
                        // 2. find id by frontId in Subjects or Types
                        const Types = getSubjectModel("type");  
                        let type = await Types.findOne({frontId: item[6], owner});  
                        if (!type){
                            const Subjs = getSubjectModel("subject");  
                            type = await Subjs.findOne({frontId: item[6], owner});  
                        }; 
                        if (type){                 
                            typeParams.push({name: result.name,  _id: paramId, value: {name: type.name,id: type._id.toString(),type:item[6]}}); 
                        };
                    };                         
                    // 3. find current parameter and update 
                    const Subjects = getSubjectModel(item[3]);
                    const resSubj = await Subjects.findOneAndUpdate({frontId: item[1], owner}, {params: typeParams, source: item[3]},{new: true});                  
                    console.log("!!!!!! resSubj: ",resSubj);
                };                                            
                if (item[7]){                     
                    const cardHeaderParams = await convertParamsToArray (item[7],owner); 
                    const Subjects = getSubjectModel(item[3]);
                    // const resSubj = 
                    await Subjects.findOneAndUpdate({frontId: item[1], owner}, {cardHeaderParams, source: item[3]},{new: true});                  
                    // console.log("!!!!!! resSubj: ",resSubj);
                };                                              
                if (item[8]){                     
                    const cardTableParams = await convertParamsToArray (item[8],owner); 
                    const Subjects = getSubjectModel(item[3]);
                    // const resSubj = 
                    await Subjects.findOneAndUpdate({frontId: item[1], owner}, {cardTableParams, source: item[3]},{new: true});                  
                    // console.log("!!!!!! resSubj: ",resSubj);
                };
                if (item[9]){                     
                    const formula = await formulas(item[9],item[3],owner);
                    // console.log(formula);
                    const Subjects = getSubjectModel(item[3]);
                    await Subjects.findOneAndUpdate({frontId: item[1], owner}, {formula, source: item[3]},{new: true});     
                };
            };
        };
    };
    if (resArray){
        res.status(201).json(resArray);
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