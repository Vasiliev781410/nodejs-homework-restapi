const {BusinessProcess} = require('../models/business-process');
const {getSubjectModel} = require('../models/subjects-select');
const {HttpError} = require('../helpers');
const {ctrlWrapper} = require('../utils');

const listBp =   async (req, res, next) => {
    const {_id: owner} = req.user;            
  
    const result = await BusinessProcess.find({owner},"-owner").populate("owner", "email subscription");
    res.json(result); 
}

const getBpByFrontId =   async (req, res, next) => {
    // const {_id: owner} = req.user; 
    const {id} = req.params;  
    const result = await BusinessProcess.findById(id);
    if (!result){ 
        throw HttpError(404,`Business-process with id ${id} not found`);      
    }    
    res.json(result);  
}

const addBp =   async (req, res, next) => {
    const {_id: owner} = req.user;    
    const result = await BusinessProcess.create({...req.body, owner});
        
    res.status(201).json(result);
}

const removeBp =  async (req, res, next) => {
    const {id} = req.params;
    console.log("id ",id);  
    const result = await BusinessProcess.findByIdAndDelete(id);
    if (!result){ 
      throw HttpError(404,`Business-process with id ${id} not found`);      
    }    
    res.status(204).send(); 
}

const updateBp =   async (req, res, next) => {   
    const {id} = req.params;
    // const { processId } = req.body;
    console.log(req.body);
  
   
    const result = await BusinessProcess.findByIdAndUpdate(id,req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Business-process with id ${id} not found`);      
    };

    res.json(result);
}

const findParamSubject =   async (mainParam,param) => {  
    let value = 0; 
    const Subjects = getSubjectModel(mainParam.value.type); 
    const subject = await Subjects.findById(mainParam.value._id);
    if (!subject){ 
      throw HttpError(404,`${mainParam.value.type}  with id ${mainParam.value._id} not found`);      
    };

    const addParam = subject.params.find(item => item._id === param.paramId);
    if (addParam){
        value = addParam.value.name;
    };

    return value;
}

const findParamCommon = (calculatedBp, param, mainParam) => {
    let value = 0;
    let parameter = {};
    if (!mainParam.type){
        parameter = calculatedBp.cardHeaderParams.find(item => item._id === param.paramId);   
    }else{
        parameter = calculatedBp.cardHeaderParams.find(item => item._id === mainParam.paramId);     
    };
     
    if (parameter && !mainParam.type){               
        value = parameter.value.name;     
    }else if (parameter){
        value = findParamSubject(parameter,param);         
    };

    try{            
        value = Number(value);                        
    }catch{
        value = 0;
    }; 

    return value;  
};

const count = (calculatedBp,item) => {
    let result = 0;
    // console.log('item.formula: ',item.formula);
    let sign = "";
    let paramValue = 0;
    let step = 1;   
    let mainParam = {value: 0, type: ""};
    item.formula.forEach((param,index) => {      
        let needCount = true; 
        let next = {type: ""};
        if (param.type === "number"){
            try{
                paramValue = Number(param.paramName); 
            }catch{
                throw HttpError(500,`Unable to count in process ${calculatedBp._id}`);   
            };                 
        }else if (param.type === "parameter"){ 
             // 1. find parameters     
            paramValue = findParamCommon(calculatedBp, param, mainParam); 
       
            if (index + 1 < item.formula.length){
                next = item.formula[index+1];
                if (next.type === "dot"){
                    needCount = false; 
                    mainParam = {value: paramValue, type: param.type};
                }else{
                    mainParam = {value: 0, type: ""}; 
                };
            }; 

        }else  { 
            needCount = false;
       };   

        // 2. count current result  
        if (needCount){      
            if (sign === "+"){
                result = result + paramValue;
            }else if (sign === "-"){
                result = result - paramValue;
            }else if (sign === "*"){
                // console.log("result: ",result);
            //  console.log("paramValue: ",paramValue);
                result =  result * paramValue;
                
            }else if (sign === "/"){
                result = result / paramValue;
            };
            if (step === 1){
                result = paramValue; 
            };
        };
        // utils for count
        if (param.type === "sign"){
            sign = param.paramName;    
        };
       
        step = step + 1;        
     }                      
    );

    
    return result;  
}; 

const updateParamValue = (calculatedBp,countResult,currentParam) => {
    // console.log("updateParamValue calculatedBp ",calculatedBp); 
    const previousValue = calculatedBp.cardHeaderParams.find(item => item._id === currentParam.variableId);   
      
    if (previousValue){ 
        const newValue = {name: countResult.toString(), _id: previousValue.value._id, type: previousValue.value.type};
        // if (currentParam.variable === "quantity"){
            previousValue.value = {...newValue}; 
        // };          
    };

    return calculatedBp;
};

const calculation =   (calculatedBp) => { 
    const formulaSequence = calculatedBp.formula;
    let countResult = 0;     
    formulaSequence.forEach(item => {          
        countResult = count(calculatedBp,item);  
        // countResult = 14;               
        calculatedBp = updateParamValue(calculatedBp,countResult,item);
        }           
    );

    return calculatedBp;  
};  

const calculationBp =   async (req, res, next) => {   
    const {id} = req.params;
    // const { processId } = req.body;
    // console.log(req.body);
     
    let result = await BusinessProcess.findByIdAndUpdate(id,req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Business-process with id ${id} not found`);      
    };

    const calculatedBp = calculation({_id: id, cardHeaderParams: [...result.cardHeaderParams], formula: [...result.formula]});
    const updatedElem = { id, cardHeaderParams: [...calculatedBp.cardHeaderParams] };
  
    result = await BusinessProcess.findByIdAndUpdate(id,updatedElem, {new: true});       
  
    res.json(result);
}

module.exports = {
    listBp: ctrlWrapper(listBp),
    getBpByFrontId: ctrlWrapper(getBpByFrontId),
    addBp: ctrlWrapper(addBp),
    removeBp: ctrlWrapper(removeBp),
    updateBp: ctrlWrapper(updateBp),
    calculationBp: ctrlWrapper(calculationBp),
};