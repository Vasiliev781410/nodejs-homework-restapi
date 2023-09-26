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
  parentId: Joi.string(),  
});

const schemas = {
    addSchema,
}

module.exports = {
    BusinessProcess,
    schemas
};