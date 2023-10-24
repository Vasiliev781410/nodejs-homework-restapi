const {Schema, model} = require('mongoose');
const Joi = require('joi');
const {handleMongooseError} = require('../helpers');

const subjectsSchema = new Schema({      
    name: {
      type: String,
    },
    nameChanged: {
      type: Boolean,
      default: false,
    },
    path: {
      type: String,
      required: true,
    },
    frontId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    elemSource: {
     type: String,
     default: '',
    },
    elemSourceId: {
      type: String,
      default: '',
    },
    masterId: {
      type: String,
      default: '',
    },
    parentId: {
      type: String,
      default: null,
    },
    params: {
      type: Array,
      default: [],
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

subjectsSchema.post("save",handleMongooseError);

const getSubjectModel =   (subject) => { 
  const Subjects = model(subject,subjectsSchema);

  return Subjects;
}

const addSchema = Joi.object({
    name: Joi.string(),
    nameChanged: Joi.boolean(),
    path: Joi.string().required(),
    source: Joi.string().required(),
    frontId: Joi.string().required(),
    elemSource: Joi.string(),
    elemSourceId: Joi.string(),
    masterId: Joi.string(),
    parentId: Joi.string(),  
});

// const updateOther = Joi.object({
//   name: Joi.string(),
//   nameChanged: Joi.boolean(),
//   path: Joi.string().required(),
//   frontId: Joi.string().required(),
// });

const updateParams = Joi.object({
  params: Joi.array().required(),
  source: Joi.string().required(),
});

const updateCardHeaderParams = Joi.object({
  cardHeaderParams: Joi.array().required(),
  source: Joi.string().required(),
});

const updateCardTableParams = Joi.object({
  cardTableParams: Joi.array().required(),
  source: Joi.string().required(),
});

const updateSequence = Joi.object({
  sequence: Joi.array().required(),
  source: Joi.string().required(),
});

const schemas = {
    addSchema,
    updateParams,
    updateSequence,
    updateCardHeaderParams,
    updateCardTableParams,
}

module.exports = {
    getSubjectModel,
    schemas
};