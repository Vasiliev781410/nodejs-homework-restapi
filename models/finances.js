const {Schema, model} = require('mongoose');
const Joi = require('joi');
const {handleMongooseError} = require('../helpers');

const schema = new Schema({        
    organization: {
      type: String,
      required: true,
    },
    store: {
      type: Array,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
  }     
},{versionKey: false});


schema.post("save",handleMongooseError);

const Stores = model('store',schema);

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
    Stores,
    schemas
};