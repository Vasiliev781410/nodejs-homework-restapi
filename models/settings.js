const {Schema, model} = require('mongoose');
const Joi = require('joi');
const {handleMongooseError} = require('../helpers');

const schema = new Schema({        
    sequence_name: {
        type: String,
      },
      sequence_value: {
        type: Number,
        default: 0,
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }          
},{versionKey: false});


schema.post("save",handleMongooseError);

const Counters = model('counter',schema);

const addSchema = Joi.object({
    sequence_name: Joi.string().required(),
 });


const schemas = {
    addSchema,
}

module.exports = {
    Counters,
    schemas
};