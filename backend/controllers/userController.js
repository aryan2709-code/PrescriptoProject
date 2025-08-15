// API to register user
import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary";

const registerUser = async (req,res) => {
    try {
        const {name,email,password} = req.body;
        // Checking for missing entries
        if(!name || !email || !password)
        {
            return res.json({
                success:false,
                message:"Missing Details"
            })
        }
        // validating email format
        if(!validator.isEmail(email))
        {
            return res.json({success:false,message:"Enter a valid email"})
        }

        if(password.length < 8)
        {
            return res.json({
                success:false,
                message:"Password should contain atleast 8 characters."
            })
        }

        // Hashing the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const userData = {
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData);
        const user =  await newUser.save();
        // _id 
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({
            success:true,
            token
        })
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

// API for user login
const loginUser = async (req,res) => {
    try {
        const {email,password}  = req.body;
        const user = await userModel.findOne({email});
        if(!user)
        {
            return res.json({
                success:false,
                message:"User does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch)
        {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({
                success:true,
                token
            })
        }
        else{
            res.json({
                success:false,
                message:"Invalid Credentials"
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
        
    }
}

// API to get user Profile data
const getProfile = async (req,res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');

        res.json({success:true, userData})
    } catch (error) {
        console.log(error);
        res.json({success : false, message : error.message})
    }
}


// API to update user profile
const updateProfile = async (req,res) => {
    try {
        const {userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if(!name || !phone || !dob || !gender)
        {
            return res.json({success:false,message:"One or more of the fields is missing."})
        }

        await userModel.findByIdAndUpdate(userId, {name,phone,address:JSON.parse(address),dob,gender} )
        if(imageFile)
        {
            // Uploading image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
            const imageUrl = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId,{image:imageUrl})
        }

        res.json({
            success:true,
            message:"Profile Updated"
        })
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


export {registerUser,loginUser,getProfile,updateProfile};