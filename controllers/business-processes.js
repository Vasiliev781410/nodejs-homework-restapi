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


const findParamCommon = (calculatedBp, param) => {
    let value = 0;
    let parameter = {};
    parameter = calculatedBp.cardHeaderParams.find(item => item._id === param.paramId);  
    if (parameter){         
        value = parameter.value.name;
    };    
   
    return value;  
};

const findParamAsync = async (calculatedBp, param, mainParam) => {
    let value = 0;
    const parameter = calculatedBp.cardHeaderParams.find(item => item._id === mainParam.paramId);           
      
    if (parameter){
        value = await findParamSubject(parameter,param);      
        // console.log('value 1: ',value);               
    };
  

    return value;  
};

const createElementaryFormulas = (currentFormula) => {   
    let step = 1;
    let variableId = 1;
    let newFormula = [];
    const finishTypes = ["parameter","number"];
    const signs = ["+","-","*","/"]; 
    let bracket = "";
    let sign = "";
    const newCurrentFormula = [...currentFormula];
   // const  newCurrentFormula = currentFormula.toReversed();
    currentFormula.reverse().forEach(currentValue => {
        // console.log("currentValue: ", currentValue);
    
        let finish = false;
        if (bracket === "(" && currentValue.paramName === ")"){
            finish = true;   
        };
        if (sign && currentValue.paramName && finishTypes.includes(currentValue.type)){
            finish = true;   
        }; 
        // console.log({step, length: currentFormula.length});
        if (step ===  currentFormula.length){            
            finish = true;   
        }; 
        // add new element of simple formula
        newFormula.push({
            id: step, 
            paramId: currentValue.paramId, 
            paramName: currentValue.paramName,
            type: currentValue.type,
            tempVariableId: variableId});
        // delete last element currentFormula
        newCurrentFormula.shift();       
            
        if (finish){          
            // add simple temp variable 
            newCurrentFormula.push({
                id: variableId, 
                paramId:"", 
                paramName: variableId,
                type: "temp",
                tempVariableId: "", 
            });
            variableId = variableId + 1;
         };             
        if (currentValue.paramName === ")"){
            bracket = currentValue.paramName;
        }
        else if (currentValue.paramName === "("){  
            bracket = currentValue.paramName;
        }
        else if (signs.includes(currentValue.paramName)){  
            sign = currentValue.paramName;   
        };   
    
        step = step + 1;

    });

    newFormula.reverse();
    // console.log("newFormula: ",newFormula);
    // console.log("newCurrentFormula: ",newCurrentFormula);
    newFormula = [...newFormula, ...newCurrentFormula];
    // console.log("newFormula: ",newFormula);

    return newFormula;
};

const transformFormula = (formula) => {  
    const newFormula = createElementaryFormulas([...formula]);
    
    return newFormula;
};

const count = async (calculatedBp,item) => {
    let result = 0;
    let mainResult = 0;   
    let sign = "";
    let paramValue = 0;
    let step = 1;   
    let mainParam = {value: 0, type: ""};
    let needCount = true; 
    let previousParam = {};    
    let currentTempVariableId = ""; 
    const tempStore = [];  // example [{variableId: "",value: 0}]
    const formula = transformFormula( item.formula);
    for (const param of formula) { 
        // console.log(param);
       
        if (currentTempVariableId !== param?.tempVariableId){            
            if (currentTempVariableId){ // put in storage value of currentTempVariable
                tempStore.push({variableId: currentTempVariableId, value: result});
                result = 0;
            };           
            currentTempVariableId =param?.tempVariableId; // update currentTempVariableId
        };

        if (!param?.tempVariableId){
            result = mainResult;
        };
        
        needCount = true; 
        let next = {type: ""};
        if (param.type === "number"){
            try{
                paramValue = Number(param.paramName); 
            }catch{
                throw HttpError(500,`Unable to count in process ${calculatedBp._id}`);   
            };                 
        }else if (param.type === "parameter"){                    
            if (mainParam.type){ // 1. find parameters 
                paramValue = await findParamAsync(calculatedBp, param, mainParam);               
            }else{
                paramValue = findParamCommon(calculatedBp, param);                
            };
             if (step < formula.length){
                next = formula[step];
                if (next.type === "dot"){
                    needCount = false; 
                    mainParam = {value: paramValue, type: param.type, paramId:  param. paramId};
                }else{                
                    mainParam = {value: 0, type: ""}; 
                };
            };
        }else if (param.type === "temp"){ 
            // 1. find parameters          
               const tempStoreElem  = tempStore.find(elem => elem.variableId === param.id); 
               if (tempStoreElem){
                paramValue = tempStoreElem.value;
               }; 
        }else  { 
            needCount = false;
       };      

       console.log({paramValue, paramName: param.paramName});
        if (needCount){   // 2. count current result     
            if (sign === "+"){
                result = result + paramValue;
            }else if (sign === "-"){
                result = result - paramValue;
            }else if (sign === "*"){        
                result =  result * paramValue;                
            }else if (sign === "/"){
                result = result / paramValue;
            };
            if (step === 1){
                result = paramValue; 
            };
        };
        if (step === formula.length){
            result = paramValue; 
            console.log("!!!!!!");
        };
        if (previousParam.type === "dot"){           
            result = paramValue; 
        };
        if (!param?.tempVariableId){
            mainResult = result;
        };        
        // utils for count
        if (param.type === "sign"){
            sign = param.paramName;    
        };       
        previousParam = param;
        step = step + 1;        
    };                     
  
    return mainResult;  
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

const calculation =  async (calculatedBp) => {
    const formulaSequence = calculatedBp.formula;
    let countResult = 0;  
    for (const item of formulaSequence){          
        countResult = await count(calculatedBp,item);  
        // countResult = 14;               
        calculatedBp = updateParamValue(calculatedBp,countResult,item);
    };           
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
          

    const calculatedBp = await calculation({_id: id, cardHeaderParams: [...result.cardHeaderParams], formula: [...result.formula]});
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