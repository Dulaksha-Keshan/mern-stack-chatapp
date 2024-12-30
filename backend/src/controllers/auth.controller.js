import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/util.js"
import User from "../models/users.model.js"
import bcryptjs from "bcryptjs"


export const signup =  async (req, res) => {
    const {fullName,email,password} = req.body
    try {

        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        //hashing password using bcryptjs
        if(password.length < 6){
            return res.status(400).json({message: "Password should be at least 6 characters long"})
        }

        const user = await User.findOne({email})

        if(user){ return res.status(400).jason({message: "Email already exists"})}

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)

        const newUser = await new User({
            fullName ,
            email ,
            password: hashedPassword
        })

        if(newUser){
            //generate  JWT toekn here 
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                message: "User created successfully",
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt

            })

        }else{res.status(400).json({message: "Invalid user data"})}
        
    }catch (error) {
        console.log(`Error in the signup controller:`,error);
        res.status(500).json({message: "Internal server error"})
    }
} 

export const login = async (req, res) => {
    const {email,password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Invalid credentials provided"})
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials provided"})
        }

        //generate JWT token here
        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt

        })


    } catch (error) {
        console.log(`Error in the login controller:`,error);
        res.status(500).json({message: "Internal server error"})
    }
} 

export const logout =  (req, res) => {
    try {
        res.cookie("jwt","",{maxAge: 0})
        res.status(200).json({message: "User logged out successfully"})
    } catch (error) {
        console.log(`Error in the logout controller:`,error);
        res.status(500).json({message: "Internal server error"})
    }
} 

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({message: "Profile picture is required"})
        } 
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log(`Error in the updateProfile controller:`,error);
        res.status(500).json({message: "Internal server error"})
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(`Error in the checkAuth controller:`,error);
        res.status(500).json({message: "Internal server error"})
    }
}