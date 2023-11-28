const {BusinessProcess} = require('../models/business-process');
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

const count = (calculatedBp,formula) => {
    let result = 0;
    let sign = "";
    let paramValue = 0;
    let previousParam = {value: null, type: null};
    let step = 1;
    // let mainParam = {value: null, type: null};
    formula.forEach(item => {
        if (item.value.type === "number"){
            try{
                paramValue = Number(item.value.name); 
            }catch{
                throw HttpError(500,`Unable to count in process ${calculatedBp._id}`);   
            };                 
        }else if (item.value.type === "parameter" || item.value.type === "dot"){ 
             // 1. find parameters               
            result = result + 0;
        };  

        // 2. count result        
        if (sign === "+"){
            result = result = result + paramValue;
        }else if (sign === "-"){
            result = result = result - paramValue;
        }else if (sign === "*"){
            result = result = result * paramValue;
        }else if (sign === "/"){
            result = result = result / paramValue;
        };

        if (step === 1){
            result = paramValue; 
        };
        
        if (item.value.type === "sign"){
            sign = item.value.name;
        }else if (previousParam.type !== "dot"){
           sign = ""; 
        };
        if (item.value.type === "parameter"){                
            previousParam = {value: paramValue, type: item.value.type};
        }; 
        if (previousParam.type === "dot"){
            // mainParam = {...previousParam};
            result = result + 0;
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
        const newValue = {name: countResult, _id: previousValue.value._id, type: previousValue.value.type};
        if (currentParam.variable === "quantity"){
            previousValue.value = {...newValue}; 
        };          
    };

    return calculatedBp;
};

const calculation =   (calculatedBp) => { 
    const formulaSequence = calculatedBp.formula;
    let countResult = {};     
    formulaSequence.forEach(item => {          
        countResult = count(calculatedBp,item);               
        calculatedBp = updateParamValue(calculatedBp,countResult,item);
        }           
    );

    return calculatedBp;  
};  

const calculationBp =   async (req, res, next) => {   
    const {id} = req.params;
    // const { processId } = req.body;
    console.log(req.body);
     
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