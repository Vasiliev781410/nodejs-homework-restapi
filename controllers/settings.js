const {getModel} = require('../models/settings');
const {ctrlWrapper} = require('../utils');
// const mongoose = require('mongoose');


const add =   async (req, res, next) => {
    const {_id: owner} = req.user; 
    const {data, organization} = req.body;
    const firstElement = data.shift();
    const Subjects = getModel("subject");
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
                console.log("elem: ",elem);

                let result = null;
                if (!elem){ 

                    result = await Subjects.create({...newElem, owner});
                    console.log("result: ",result);
                    res.status(201).json(result);
                }else{
                    res.status(201);
                };                    
          
            };
        };
    };
    // res.status(201);
}



module.exports = { 
    add: ctrlWrapper(add),
};