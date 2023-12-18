const { HttpError } = require('../helpers');
const {User} = require('../models/user');
const {ctrlWrapper, defaultOrganizationSettings} = require('../utils');
// const {ctrlWrapper} = require('../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = process.env;

const register =   async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user){
        throw HttpError(409,"Email in use");
    }
    const hashRassword = await bcrypt.hash(password,10);
    const newUser = await User.create({...req.body, password: hashRassword});
   
    res.status(201).json({email: newUser.email,  subscription: "starter"});

    await defaultOrganizationSettings(newUser);
}

const login =   async (req, res, next) => {
    console.log("req.body: ",req.body);

    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user){
        throw HttpError(401,"Email or password is wrong");
    }  
    
    const passwordCompare = await bcrypt.compare(password,user.password);
    if (!passwordCompare){
        throw HttpError(401,"Email or password is wrong");
    }  
   
    const payload = {id: user._id}; 
    // console.log("user._id: ",user._id);
   
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

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
};