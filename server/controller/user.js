import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import UserModel from '../models/user.js';

export const signUp=async(req,res)=>{
    const {email,firstName,lastName,password}=req.body;
    try {
        const existingUser=UserModel.findOne({email});

        if(!existingUser){
            return res.status(400).send({
                message:"User already exist"
            })
        }

        const hashPassword=await bcrypt.hash(password,12);

        const result=await UserModel.create({
            email,
            password:hashPassword,
            name:`${firstName} ${lastName}`
        })

        const token=jwt.sign({email:result.email,id:result._id},process.env.SERVER_SECRET,{expiresIn:"1h"})

        res.status(201).send({result,token})
    
    }catch(error) {
        res.status(500).send({
            message:"Somthing went wrong"
        })
        console.log(error);
    }
}   


export const signIn=async(req,res)=>{
    const {email,password}=req.body;

    try {
        const existingUser=await UserModel.findOne({email});

        if(!existingUser) return res.status(404).send({
            message:"User doesn't exist"
        })

        const matchPassword=await bcrypt.compare(password,existingUser.password);
        
        if(!matchPassword) return res.status(400).send({
            message:"Password doesn't matched"
        })

        const token=jwt.sign({email:existingUser.email,id:existingUser._id},process.env.SERVER_SECRET,{expiresIn:"1h"});

        res.status(200).send({existingUser,token})

    }catch (error) {
        res.status(500).send({
            message:"Somthing went wrong"
        })
        console.log(error);
    }
}