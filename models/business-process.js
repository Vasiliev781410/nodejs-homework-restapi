const {Schema, model} = require('mongoose');
const Joi = require('joi');
const {handleMongooseError} = require('../helpers');

const businessProcessSchema = new Schema({        
    name: {
      type: String,
      required: [true, 'Set name for busines-process'],
    },
    path: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
  }     
},{versionKey: false});

businessProcessSchema.post("save",handleMongooseError);

const BusinessProcess = model('business-process',businessProcessSchema);

const addSchema = Joi.object({
    name: Joi.string().required(),
    path: Joi.string().required(),
});


const schemas = {
    addSchema,
}

module.exports = {
    BusinessProcess,
    schemas
};