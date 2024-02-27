const {Schema, model} = require('mongoose');
const Joi = require('joi');
const {handleMongooseError} = require('../helpers');

const schema = new Schema({        
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


schema.post("save",handleMongooseError);

const getModel =   (subject) => { 
    const Subjects = model(subject,schema);
  
    return Subjects;
}



const addSchema = Joi.object({
    organization: Joi.string().required(),
    data: Joi.array().required(),
});


const schemas = {
    addSchema,
}

module.exports = {
    getModel,
    schemas
};