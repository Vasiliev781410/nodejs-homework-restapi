const {getSubjectModel} = require('../models/subjects-select');
// const  nanoid  = require('nanoid');

const getDefaultSubjects = organization => {  
  const subject = [
    {name:"Контрагенти", nameChanged: true, path: "/counterparty", frontId: "counterparty", source: "subject", custom: false, financial: true, master: "", elemSource: "", parentId: null, params: [],organization},
    {name:"Співробітники", nameChanged: true, path: "/employee", frontId: "employee", source: "subject", custom: false, financial: true, master: "organization", elemSource: "", parentId: null, params: [],organization},
    {name:"Організації", nameChanged: true, path: "/organization", frontId: "organization", source: "subject", custom: false, financial: true, master: "", elemSource: "", parentId: null, params: [],organization},
    {name:"Рахунки організаціїї", nameChanged: true, path: "/organization-account", source: "subject", frontId: "organization-account", custom: false, financial: true, master: "organization", elemSource: "", parentId: null, params: [],organization},

    {name:"Бізнес-процеси", nameChanged: true, path: "/bp", frontId: "bp", source: "subject", custom: false, financial: false, master: "", elemSource: "", parentId: null, params: [],organization},
    {name:"Процеси", nameChanged: true, path: "/process", frontId: "process", source: "subject", custom: false, financial: false, master: "", elemSource: "", parentId: null, params: [],organization},
    {name:"Параметри", nameChanged: true, path: "/parameter", frontId: "parameter", source: "subject", custom: false, financial: false, master: "", elemSource: "", parentId: null, params: [{name: "type", _id: "type", value:{name: null, _id: null, type: "subject"}}],organization},
    
    {name:"Фінанси", nameChanged: true, path: "/finance", frontId: "finance", source: "subject", custom: false, financial: false, master: "", elemSource: "", parentId: null, params: [],organization},
    {name:"Види операцій", nameChanged: true, path: "/operation", frontId: "operation", source: "subject", custom: false, financial: false, master: "", elemSource: "", parentId: "finance", params: [],organization},
    {name:"Проводки", nameChanged: true, path: "/entrie", frontId: "entrie", source: "subject", custom: false, financial: false, master: "", elemSource: "", parentId: "finance", params: [],organization},
    {name:"План рахунків", nameChanged: true, path: "/accountcharte", frontId: "accountcharte", source: "subject", custom: false, financial: false, master: "", elemSource: "", parentId: "finance", params: [],organization},
    {name:"Аналітика рахунків", nameChanged: true, path: "/accountanalytics", frontId: "accountanalytics", source: "subject", custom: false, financial: false, master: "", elemSource: "", parentId: "finance", params: [],organization},
    {name:"Налаштування бух. обліку", nameChanged: true, path: "/accountsettings", frontId: "accountsettings", source: "subject", custom: false, financial: false, master: "", elemSource: "", parentId: "finance", params: [],organization},
  ];
  return subject;
};

const defaultOrganizationSettings = async (newUser)  =>{
    const {_id: owner} = newUser; 

    // 1. Створюємо организацію за замовчуванням  
    let source = "organization"; 
    let Subjects = getSubjectModel("organization");
    const organization = "Our team";
    // const frontIdNewElem = nanoid();
    let frontIdNewElem = "1";
    let newElem = {name: organization, path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization};

    await Subjects.create({...newElem, owner});
    // 2. Створюємо параметри за замовчуванням
    source = "parameter";   
    Subjects = getSubjectModel(source);
    frontIdNewElem = "type";
    newElem = {name: frontIdNewElem, path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization};
         
    await Subjects.create({...newElem, owner});  

    // 3. Створюємо види операцій за замовчуванням 
    source = "operation"; 
    Subjects = getSubjectModel(source);
    // const frontIdNewElem = nanoid();
   
    newElem = {name: "Закупка", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization};

    await Subjects.create({...newElem, owner}); 
    
    // const frontIdNewElem = nanoid();
    newElem = {name: "Реалізація", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization};

    await Subjects.create({...newElem, owner});  
      
    // 4. Створюємо налаштування проводок за замовчуванням 
    source = "entrie";  
    Subjects = getSubjectModel(source);
    // const frontIdNewElem = nanoid();
    newElem = {name: "Закупка сировини", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization};
 
    await Subjects.create({...newElem, owner});
     
    // 5. Створюємо план рахунків за замовчуванням 
    source = "accountcharte";  
    Subjects = getSubjectModel(source);
    // const frontIdNewElem = nanoid();
    newElem = {name: "10", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization};
     
    await Subjects.create({...newElem, owner}); 

    // 6. Створюємо аналітику рахунків за замовчуванням 
    source = "accountanalytics";   
    Subjects = getSubjectModel(source);
    // const frontIdNewElem = nanoid();
    newElem = {name: "Витрати підрозділів", path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization};
       
    await Subjects.create({...newElem, owner});         

    // 7. Створюємо налаштування бух. обліку за замовчуванням
    source = "accountsettings";   
    Subjects = getSubjectModel(source);
    // const frontIdNewElem = nanoid();
    newElem = {name: organization, path: "".concat("/",frontIdNewElem), frontId: frontIdNewElem, source, parentId: "",organization};
         
    await Subjects.create({...newElem, owner});  

    // 8. Додамо перелік довідників за замовчуванням
    source = "subject";   
    Subjects = getSubjectModel(source);
    const defaultSubjects = getDefaultSubjects(organization);
    for (const item of defaultSubjects) { 
      await Subjects.create({...item, owner}); 
    };
};

module.exports = defaultOrganizationSettings;
