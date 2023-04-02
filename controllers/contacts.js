const {Contact} = require('../models/contact');
const {HttpError} = require('../helpers');
const {ctrlWrapper} = require('../utils');

const listContacts =   async (req, res, next) => {
    const result = await Contact.find();
    res.json(result); 
}

const getContactById =   async (req, res, next) => {
    const {contactId} = req.params;  
    const result = await Contact.findById(contactId);
    if (!result){ 
        throw HttpError(404,`Book with id ${contactId} not found`);      
    }    
    res.json(result);  
}

const addContact =   async (req, res, next) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
}

const removeContact =  async (req, res, next) => {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result){ 
      throw HttpError(404,`Book with id ${contactId} not found`);      
    }    
    res.status(204).send(); 
}

const updateContact =   async (req, res, next) => {   
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId,req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Book with id ${contactId} not found`);      
    }    
    res.json(result);
}

const updateFavorite =   async (req, res, next) => {   
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId,req.body, {new: true});
    if (!result){ 
      throw HttpError(404,`Book with id ${contactId} not found`);      
    }    
    res.json(result);
}


module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),
    updateFavorite: ctrlWrapper(updateFavorite)
};