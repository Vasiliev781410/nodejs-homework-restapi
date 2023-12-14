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
    organization: Joi.string().required(),
    store: Joi.array().required(),
});


const schemas = {
    addSchema,
}

module.exports = {
   Stores,
    schemas
};