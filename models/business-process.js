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
    frontId: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
  }     
},{versionKey: false});

businessProcessSchema.post("save",handleMongooseError);

const BusinessProcess = model('business-processes',businessProcessSchema);

const addSchema = Joi.object({
    name: Joi.string(),
    path: Joi.string().required(),
    frontId: Joi.string().required(),
});


const schemas = {
    addSchema,
}

module.exports = {
    BusinessProcess,
    schemas
};