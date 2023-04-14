const {Schema, model} = require('mongoose');
const Joi = require('joi');

const {handleMongooseError} = require('../helpers');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    email: {
      type: String,
      match: emailRegexp, 
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String
    },   
  },{versionKey: false, timestamps: true});

  userSchema.post("save",handleMongooseError);

  const User = model('user',userSchema);

  const registerSchema = Joi.object({
    email: Joi.string().required().pattern(emailRegexp),
    password: Joi.string().required().min(6),
});

const schemas = {
    registerSchema,
}

module.exports = {
    User,
    schemas
};