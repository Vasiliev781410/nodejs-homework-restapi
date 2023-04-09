const { HttpError } = require('../helpers');
const {User} = require('../models/user');
const {ctrlWrapper} = require('../utils');
const {bcryptjs} = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = process.env;

const register =   async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user){
        throw HttpError(409,"Email in use");
    }
    const hashRassword = await bcryptjs.hash(password,10);
    const newUser = await User.create({...req.body, password: hashRassword});

    res.status(201).json({email: newUser.email,  subscription: "starter"});
}

const login =   async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user){
        throw HttpError(401,"Email or password is wrong");
    }  
    
    const passwordCompare = await bcryptjs.compare(password,user.password);
    if (!passwordCompare){
        throw HttpError(401,"Email or password is wrong");
    }  

    const payload = {_id: user.id};    
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'});
    res.status(200).json({token, user: {email,  subscription: user.subscription}});
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
};