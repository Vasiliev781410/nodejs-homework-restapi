const { HttpError, sendEmail } = require('../helpers');
const {User} = require('../models/user');
const {ctrlWrapper} = require('../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs').promises;
const path = require('path');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');

const avatarDir = path.join(__dirname,'../','public','avatars');

const {SECRET_KEY, BASE_URL} = process.env;

const register =   async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user){
        throw HttpError(409,"Email in use");
    }
    const hashRassword = await bcrypt.hash(password,10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();
    const newUser = await User.create({...req.body, password: hashRassword, avatarURL,verificationToken});

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        text: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.status(201).json({email: newUser.email,  subscription: "starter"});
}

const verifyEmail =   async (req, res, next) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if (!user){
        throw HttpError(404,"User not found");
    }
    
    await User.findByIdAndUpdate(user._id,{verify: true, verificationToken: ""});
               
    res.json({message: "Verification successful"});
}

const resendEmail =   async (req, res, next) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user){
        throw HttpError(404,"User not found");
    }
    if (user.verify){
        throw HttpError(400,"Verification has already been passed");
    }  
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        text: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
    }

    await sendEmail(verifyEmail); 
                           
    res.json({message: "Verification email sent"});
}


const login =   async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user){
        throw HttpError(401,"Email or password is wrong");
    } 
    
    if (!user.verify){
        throw HttpError(400,"Verify email");
    }  
    
    const passwordCompare = await bcrypt.compare(password,user.password);
    if (!passwordCompare){
        throw HttpError(401,"Email or password is wrong");
    }  

    const payload = {id: user._id};    
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'});
    await User.findByIdAndUpdate(user._id,{token});

    res.status(200).json({token, user: {email,  subscription: user.subscription}});
}

const getCurrent =   async (req, res, next) => {
    const {email, subscription} = req.user;   
               
    res.json({email,  subscription});
}

const logout =   async (req, res, next) => {
    const {_id} = req.user; 
    await User.findByIdAndUpdate(_id,{token: ""});  
               
    res.status(204).json({message: ""});
}

const updateAvatar = async (req, res, next) => {
    const {path: tempUpload, filename} = req.file;    
    const {_id} = req.user; 
    const savename = `${_id}_${filename}`;   
    const resultUpload = path.join(avatarDir,savename); 

    await fs.rename(tempUpload,resultUpload);

    const image = await Jimp.read(resultUpload);   
    image.resize(250,250).write(resultUpload); 
          
    const avatarURL = path.join('avatars',savename);   
    await User.findByIdAndUpdate(_id,{avatarURL});
               
    res.status(200).json({avatarURL});
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendEmail: ctrlWrapper(resendEmail)
};