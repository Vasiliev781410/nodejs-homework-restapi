const {Schema, model} = require('mongoose');
const Joi = require('joi');
const {handleMongooseError} = require('../helpers');

const subjectsSchema = new Schema({        
    name: {
      type: String,
    },
    nameId: {
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
    master: {
      type: String,
      default: "",
    },
    elemSource: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
  }     
},{versionKey: false});


subjectsSchema.post("save",handleMongooseError);

const Subjects = model('subjects',subjectsSchema);

const addSchema = Joi.object({
    name: Joi.string(),
    nameId: Joi.string().required(),
    custom: Joi.boolean(),
    financial: Joi.boolean(),
    master: Joi.string(),
    elemSource: Joi.string(),
});


const schemas = {
    addSchema,
}

module.exports = {
    Subjects,
    schemas
};