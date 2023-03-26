const express = require('express')
const contacts = require("../../models/contacts")

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);    
  } catch (error) {
    res.status(500).json({message: error.message});
  } 
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;  
    const result = await contacts.getContactById(contactId);
    if (!result){          
      return res.status(404).json({message: `Book with id ${contactId} not found`});
    }
    
    res.json(result);    
  } catch (error) {
    res.status(500).json({message: error.message});
  } 
})

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
