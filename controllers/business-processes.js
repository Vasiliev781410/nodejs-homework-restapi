const {BusinessProcess} = require('../models/business-process');
const {getModel} = require('../models/finances');
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
const  multiplyAndDivide = (newCurrentFormula,tempFormula,itr,mainVariableName) =>{
    let variableId = 1;
    let step = 1;
    const variableSymbol = "m"; 
    const variableName = variableSymbol.concat(itr,".",variableId);     
    const arraySigns = newCurrentFormula.filter(item => item.paramName === "*" || item.paramName === "/");
    // console.log("multiplyAndDivide arraySigns: ",arraySigns);
    arraySigns.forEach(item => {
        const values = newCurrentFormula.map(param => param.paramName); 
        const index = values.indexOf(item.paramName);
        // console.log("multiplyAndDivide index: ",index);
        if (index !== -1){
            const params = newCurrentFormula.slice(index-1,index+2);
            // console.log("multiplyAndDivide params: ",params);
            params.forEach(currentValue => {
                // add new element of simple formula
                let id = "";
                currentValue.type === "temp" ? id = currentValue.id : id =  step;
                tempFormula.push({
                    id, 
                    paramId: currentValue.paramId, 
                    paramName: currentValue.paramName,
                    type: currentValue.type,
                    tempVariableId: variableName
                });
                step += 1;
            });
            // remove three params and insert one temp variable
            newCurrentFormula.splice(index-1,3,{
                id: variableName, 
                paramId:"", 
                paramName: variableName,
                type: "temp",
                tempVariableId: mainVariableName, 
            });
            variableId += 1;
        };        
    });
    
    // console.log("multiplyAndDivide newCurrentFormula: ",newCurrentFormula);

    return {newCurrentFormula, tempFormula}; 
};

const createElementaryFormulas = (currentFormula,tempFormula,itr) => {   
    let step = 1; 
    const arrayParams = currentFormula.map(item => item.paramName); 
    // console.log("arrayParams: ",arrayParams);
    const arraySigns = currentFormula.filter(item => item.paramName === "+" || item.paramName === "-");
    const openingBracket = arrayParams.lastIndexOf("(");
    // console.log("openingBracket: ",openingBracket);
    const closingBracket = arrayParams.indexOf(")"); 
    // console.log("closingBracket: ",closingBracket);   
    // const difference = closingBracket - openingBracket;
    const leftSide = currentFormula.slice(0,openingBracket);
    const rightSide = currentFormula.slice(closingBracket+1);
    // console.log("leftSide: ",leftSide);
    // console.log("rightSide: ",rightSide);
    // console.log("difference: ",difference);
    let newData = {};
    let newCurrentFormula = [...currentFormula]; 
    if (openingBracket !== -1){
        newCurrentFormula = newCurrentFormula.slice(openingBracket+1,closingBracket);
    };  
    // console.log("newCurrentFormula: ",newCurrentFormula);
    const variableId = 1; 
    const variableSymbol = "v";  
    const variableName = variableSymbol.concat(itr,".",variableId);   
    // 1. Multiply and divide
    newData = multiplyAndDivide(newCurrentFormula,tempFormula,itr,variableName);    
    newCurrentFormula = newData.newCurrentFormula;   
    tempFormula = newData.tempFormula;
    // 2. Add and subtract
    newCurrentFormula.forEach(currentValue => {  
        // add new element of temp formula
        let id = "";
        currentValue.type === "temp" ? id = currentValue.id : id =  step;
        tempFormula.push({
            id: id, 
            paramId: currentValue.paramId, 
            paramName: currentValue.paramName,
            type: currentValue.type,
            tempVariableId: variableName});   
        step = step + 1;
    });
  
    const newVariable = {
        id: variableName, 
        paramId:"", 
        paramName: variableName,
        type: "temp",
        tempVariableId: variableName, 
    };  
    
    if (openingBracket !== -1){
        currentFormula = leftSide.concat(newVariable,rightSide);
    }else{
        currentFormula = [];  
        if (arraySigns.length){
            currentFormula = [newVariable]; 
        }; 
    };
    // console.log("currentFormula: ",currentFormula);
    // console.log("tempFormula: ",tempFormula);
    return {newCurrentFormula: currentFormula,tempFormula};
};

const transformFormula = (formula) => { 
    const brackets = formula.filter(item => item.paramName === "(");
    const bracketsLength = brackets.length + 1;  
    const tempFormula = [];    
    let newData = {newCurrentFormula: [...formula],tempFormula};   
    for (let i = 1; i <= bracketsLength; i += 1){         
        newData = createElementaryFormulas(newData.newCurrentFormula,tempFormula,i);
    };
    const newCurrentFormula = [...newData.tempFormula,...newData.newCurrentFormula];
    // console.log("!!!newCurrentFormula: ",newCurrentFormula);

    return newCurrentFormula;
};

const count = async (calculatedBp,item) => {
    let result = 0;    
    let sign = "";
    let paramValue = 0;
    let step = 1;   
    let mainParam = {value: 0, type: "", paramId: ""};
    let needCount = true; 
    let previousParam = {};    
    let currentTempVariableId = ""; 
    const tempStore = [];  // example [{variableId: "",value: 0}]
    const formula = transformFormula( item.formula);
    for (const param of formula) { 
               
        if (currentTempVariableId !== param?.tempVariableId){            
            result = 0; //  
            step = 1;      
            currentTempVariableId =param?.tempVariableId; // update currentTempVariableId
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
                if (mainParam.value){ // 1. find parameters 
                    // console.log("mainParam: ",mainParam); 
                    paramValue = await findParamAsync(calculatedBp, param, mainParam);
                }else{
                    paramValue =  "";
                    mainParam = {value: 0, type: "", paramId: ""};
                };               
            }else{
                paramValue = findParamCommon(calculatedBp, param);                
            };
             if (step < formula.length){
                next = formula[step];
                if (next.type === "dot"){
                    needCount = false; 
                    mainParam = {value: paramValue, type: param.type, paramId:  param. paramId};
                }else{                
                    mainParam = {value: 0, type: "", paramId: ""};                     
                };
            };
        }else if (param.type === "temp"){                      
            const tempStoreElem  = tempStore.find(elem => elem.variableId === param.id); // 1. find parameters 
            if (tempStoreElem){
                paramValue = tempStoreElem.value;
            }; 
        }else  { 
            needCount = false;
       };      

       // console.log({paramValue, paramName: param.paramName});
     
        if (needCount){   // 2. count current result     
            if (sign === "+"){
                result = Number(result) + paramValue;
            }else if (sign === "-"){
                result = Number(result) - paramValue;
            }else if (sign === "*"){        
                result =  Number(result) * paramValue;                
            }else if (sign === "/"){
                result = Number(result) / paramValue;
            };
            if (sign){
                sign = "";
            };
            if (step === 1){
                result = paramValue; 
            };
        };
        if (step === formula.length){
            result = paramValue; 
            // console.log("!!!!!!");
        };
        if (previousParam.type === "dot"){           
            result = paramValue; 
        };

        const tempStoreElem  = tempStore.find(elem => elem.variableId === currentTempVariableId); 
        if (tempStoreElem){
            tempStoreElem.value = result;
        }else{
            tempStore.push({variableId: currentTempVariableId, value: result});  
        };                      
        // console.log(tempStore); 
        // console.log("result: ",result);         
                   
      
        // utils for count
        if (param.type === "sign"){
            sign = param.paramName;    
        };       
        previousParam = param;
        step = step + 1;        
    };                     
  
    return result;  
}; 

const checkBelongsToFinance = (processId,variableId) => {
    const check = true;

    return check;
}

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

const updateCount = (currentCount,finance) => {
    // const updatedCount = {};

    return currentCount;
};

const deactivateOperation = (currentCount,operationId) => {
    const currentOperation = currentCount.operations.find(item => item._id === operationId); 
    if (currentOperation){
        currentOperation.active = false;
    };   
    
    return currentCount;
};

const calculation =  async (calculatedBp, owner) => {
    const formulaSequence = calculatedBp.formula;
    let countResult = 0;    
    const finance = []; 
    // finance.push(operation);
    for (const item of formulaSequence){          
        countResult = await count(calculatedBp,item);                
        calculatedBp = updateParamValue(calculatedBp,countResult,item);

         // check whether the variable belongs to finance
        const check = checkBelongsToFinance(calculatedBp.processId,item.variableId);
        // add to temp array for update finance
        if (check){
            finance.push({_id: calculatedBp._id, variableId: item.variableId, countResult, processId: calculatedBp.processId, active: true});
        };
    };       
    // console.log("finance: ",finance);
    const currency = "UAH"; 
    const operation = {currency: "UAH", sum: 14, sumUAH: 10, sumInter: 2.5,};
    if (finance.length > 0){      
        // 64da0dbb497a9d5389d0ea2a - test case
        const organization = 'Test'.concat('64da0dbb497a9d5389d0ea2a'); // ??? where do I need to get it  
        const count = "25";          
        const Finances = getModel(organization);  
        // console.log("Finances: ",Finances);
        let currentCount = await Finances.findOne({count, currency}); 
        if (currentCount){
            // turn off property of active data
            console.log("currentCount: ",currentCount);
            currentCount = deactivateOperation(currentCount,calculatedBp._id);  
            //  !!! I need to do updateCount function
            const updatedCount = updateCount(currentCount,finance);
            await Finances.findByIdAndUpdate(currentCount._id,updatedCount, {new: true}); 
        }else{
            const newCount = {count, operations: [...finance], currency: operation?.currency, sum: operation?.sum, sumUAH: operation?.sumUAH, sumInter: operation?.sumInter, };
            await Finances.create({...newCount, owner});
        };
       
       
    };
  
    return calculatedBp;  
};  

const calculationBp =   async (req, res, next) => {   
    const {id} = req.params;
    const {_id: owner} = req.user;  
    // const { processId } = req.body;
    // console.log(req.body);
     
    let result = await BusinessProcess.findByIdAndUpdate(id,req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Business-process with id ${id} not found`);      
    };
          

    const calculatedBp = await calculation({_id: id, cardHeaderParams: [...result.cardHeaderParams], formula: [...result.formula], processId: result.processId},owner);
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