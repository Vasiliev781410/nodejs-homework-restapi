const {getSubjectModel} = require('../models/subjects-select');
// const  nanoid  = require('nanoid');

const defaultOrganizationSettings = async (newUser)  =>{
    const {_id: owner} = newUser; 

    // 1. Створюємо организацію за замовчуванням  
    let source = "organization"; 
    let Subjects = getSubjectModel("organization");
    const defaultOrgaization = "new_table_name";
    // const frontIdNewElem = nanoid();
    const frontIdNewElem = "1";
    let newElem = {name: defaultOrgaization, path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization: defaultOrgaization};

    await Subjects.create({...newElem, owner});
    // 2. Створюємо види операцій за замовчуванням 
    source = "operation"; 
    Subjects = getSubjectModel(source);
    // const frontIdNewElem = nanoid();
   
    newElem = {name: "Закупка", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization: defaultOrgaization};

    await Subjects.create({...newElem, owner}); 
    
      // const frontIdNewElem = nanoid();
      newElem = {name: "Реалізація", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization: defaultOrgaization};

      await Subjects.create({...newElem, owner});  
      
     // 3. Створюємо налаштування проводок за замовчуванням 
     source = "entrie";  
     Subjects = getSubjectModel(source);
     // const frontIdNewElem = nanoid();
     newElem = {name: "Закупка сировини", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization: defaultOrgaization};
 
     await Subjects.create({...newElem, owner});
     
    // 4. Створюємо план рахунків за замовчуванням 
    source = "accountcharte";  
    Subjects = getSubjectModel(source);
    // const frontIdNewElem = nanoid();
    newElem = {name: "10", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization: defaultOrgaization};
     
    await Subjects.create({...newElem, owner}); 

    // 5. Створюємо аналітику рахунків за замовчуванням 
    source = "accountanalytics";   
    Subjects = getSubjectModel(source);
    // const frontIdNewElem = nanoid();
    newElem = {name: "Витрати підрозділів", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization: defaultOrgaization};
       
    await Subjects.create({...newElem, owner});         

    // 6. Створюємо налаштування бух. обліку за замовчуванням
    source = "accountsettings";   
    Subjects = getSubjectModel(source);
    // const frontIdNewElem = nanoid();
    newElem = {name: defaultOrgaization, path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization: defaultOrgaization};
         
    await Subjects.create({...newElem, owner});  

    // 7. Додамо перелік довідників за замовчуванням
    source = "subject";   
    Subjects = getSubjectModel(source);
      // const frontIdNewElem = nanoid();
    newElem = {name: "План рахунків", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization: defaultOrgaization};
           
    await Subjects.create({...newElem, owner});  

};

module.exports = defaultOrganizationSettings;
