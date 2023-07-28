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
    path: Joi.string().required(),
    source: Joi.string().required(),
    frontId: Joi.string().required(),
    elemSource: Joi.string(),
    elemSourceId: Joi.string(),
    masterId: Joi.string(),
    parentId: Joi.string(),
});


const schemas = {
    addSchema,
}

module.exports = {
    getSubjectModel,
    schemas
};