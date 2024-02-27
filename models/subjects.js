const {Schema, model} = require('mongoose');
const Joi = require('joi');
const {handleMongooseError} = require('../helpers');

const subjectsSchema = new Schema({        
    name: {
      type: String,
    },
    path: {
      type: String,
      required: true,
    },
    frontId: {
      type: String,
      required: true,
    },
    custom: {
      type: Boolean,
      default: false,
    },
    financial: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      required: true,
    },
    master: {
      type: String,
      default: "",
    },    
    elemSource: {
      type: String,
      default: "",
    },
    parentId: {
      type: String,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
  }     
},{versionKey: false});


subjectsSchema.post("save",handleMongooseError);

const Subjects = model('subjectss',subjectsSchema);

const addSchema = Joi.object({
    name: Joi.string(),
    path: Joi.string().required(),
    frontId: Joi.string().required(),
    source: Joi.string().required(),
    custom: Joi.boolean(),
    financial: Joi.boolean(),
    master: Joi.string(),
    elemSource: Joi.string(),
    parentId: Joi.string(),
});


const schemas = {
    addSchema,
}

module.exports = {
    Subjects,
    schemas
};