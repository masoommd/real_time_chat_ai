import User from "../models/user_models.js";
import * as userService from "../services/user_service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis_service.js";


export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser(req.body);

    const token = await user.generateJWT();

    delete user._doc.password;
    return res.status(201).json({ user, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.statue(400).json({ errors: errors.array });
  }

  try {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user) {
      return res.status(401).json({errors:"Invalid credentials"})
    }

    const isMatch = await user.isValidPassword(password);

     if(!isMatch) {
      return res.status(401).json({errors:"Invalid credentials"});
     }
     
     const token = await user.generateJWT();

     delete user._doc.password;

     return res.status(200).json({user, token});

  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message)
  }
};

export const profileController = async (req, res) => {
  const user = await User.findOne({email:req.user.email}).select("+password"); //password remove krna hai
  res.status(200).json({
    user
  })
};

export const logout = async (req,res) =>{
  try {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

    req.session.destroy(() => {
    res.clearCookie("connect.sid");
  });

    res.status(200).json({message: "Logout successful"});
  } catch (err) {
    console.log("kya haal hai:",err.message);
    res.status(400).send(err.message)
  }
};

export const getAllUsersController = async (req,res) => {
  try {
    const loggedInUser = await User.findOne({email:req.user.email});
    
    const allUsers = await userService.getAllUsers({userId:loggedInUser._id});
    return res.status(200).json({
      users:allUsers
    })
  } catch (err) {
    console.log(err.message)
    res.status(400).json({error:err.message})
  }
}