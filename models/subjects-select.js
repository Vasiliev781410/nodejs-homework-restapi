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

const updateName = Joi.object({
  name: Joi.string(),
  nameChanged: Joi.boolean(),
  path: Joi.string().required(),
  frontId: Joi.string().required(),
});


const updateParams = Joi.object({
  params: Joi.array().required(),
  source: Joi.string().required(),
});


const schemas = {
    addSchema,
    updateName,
    updateParams,
}

module.exports = {
    getSubjectModel,
    schemas
};