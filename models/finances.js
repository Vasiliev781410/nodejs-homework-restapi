const {Schema, model} = require('mongoose');
const Joi = require('joi');
const {handleMongooseError} = require('../helpers');
// sum: operation?.sum, sumUAH: operation?.sumUAH, sumBuck: operation?.sumBuck,
const schema = new Schema({        
    count: {
      type: String,
      required: true,
    },
    operations: {
      type: Array,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    }, 
    sum: {
      type: Number,
      default: 0,
    }, 
    sumUAH: {
      type: Number,
      default: 0,
    },   
    sumInter: {
      type: Number,
      default: 0,
    },                        
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }     
},{versionKey: false});


schema.post("save",handleMongooseError);

const getModel =   (subject) => { 
  const Finances = model(subject,schema);

  return Finances;
}

const addSchema = Joi.object({  
    count: Joi.string().required(),
    operations: Joi.array().required(), 
    currency: Joi.string().required(),
    sum: Joi.number(),
    sumUAH: Joi.number(),
    sumInter: Joi.number(),
});


const schemas = {
    addSchema,
}

module.exports = {
    getModel,
    schemas
};