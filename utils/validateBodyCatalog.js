const HttpError  = require('../helpers/HttpError');

const validateBodyCatalog = schema =>{
    const func = async (req, res, next) => { 
        const {object} = req.body;  
        const {error} = await schema.validate(object);
        if (error) {
            next(HttpError(400,error.message));   
        }
        next();       
    }
    return func; 
}

module.exports = validateBodyCatalog;