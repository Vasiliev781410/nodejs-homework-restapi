const {Schema, model} = require('mongoose');
const Joi = require('joi');
const {handleMongooseError} = require('../helpers');

const businessProcessSchema = new Schema({        
    name: {
      type: String,
    },
    path: {
      type: String,
      required: true,
    },
    parentId: {
      type: String, 
      default: "", 
    },
    frontId: {
      type: String,
      required: true,
    },
    processId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "",
    },
    organiztion: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    sequence:{
      type: Array,
      default: [],
    },
    cardHeaderParams:{
      type: Array,
      default: [],
    },
    cardTableParams:{
      type: Array,
      default: [],
    },
    formula:{
      type: Array,
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
  }     
},{versionKey: false});

businessProcessSchema.post("save",handleMongooseError);

const BusinessProcess = model('business-process',businessProcessSchema);

const addSchema = Joi.object({
  name: Joi.string(),
  path: Joi.string().required(),
  source: Joi.string().required(),
  frontId: Joi.string().required(),
  processId: Joi.string().required(),
  organiztion: Joi.string().required(),
  parentId: Joi.string(),  
  status: Joi.string(),  
});

const updateSchema = Joi.object({
  id: Joi.string().required(),  
});

const schemas = {
    addSchema,
    updateSchema,
}

module.exports = {
    BusinessProcess,
    schemas
};