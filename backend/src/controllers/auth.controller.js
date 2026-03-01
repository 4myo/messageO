import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullname, fullName, email, password, confirmPassword } = req.body || {};
  const normalizedFullname = fullname || fullName;

    try{
        if (!normalizedFullname || !email || !password ){
            return res.status(400).json({error: "fullname/fullName, email, and password are required"});
        }
        if (confirmPassword && password !== confirmPassword){
            return res.status(400).json({error: "Passwords do not match"});
        }
       
        if (password.length < 6) {
            return res.status(400).json({error: "Password must be at least 6 characters long"});
        }

        //check email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({error: "Invalid email format"});
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({error: "User already exists"});
        }
        //encryption
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            fullname: normalizedFullname,
            email,
            password: hashedPassword,
        })

        if (newUser) {
           generateToken(newUser._id, res);
           const savedUser = await newUser.save();

           try {
            await sendWelcomeEmail(savedUser.email, savedUser.fullname, ENV.CLIENT_URL);
           } catch (error) {
            console.log("Error sending welcome email: ", error?.message || error);
           }

           return res.status(201).json({
            _id: savedUser._id,
            fullname: savedUser.fullname,
            email: savedUser.email,
            profilePic: savedUser.profilePic,
           });
        } else {

            res.status(400).json({message: "Invalid user data"});
        }


    } catch (error) {
        console.log("Error in signup controller: ", error?.message || error);
        res.status(500).json({error: "Internal Server Error"});
    }

    
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcryptjs.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    generateToken(existingUser._id, res);
    return res.status(200).json({
      _id: existingUser._id,
      fullname: existingUser.fullname,
      email: existingUser.email,
      profilePic: existingUser.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller: ", error?.message || error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log("Error in logout controller: ", error?.message || error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        if (profilePic) return res.status(400).json({message: "Profile picture is required"});
        
        const userId= req.user._id;
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await user.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {new:true})

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in updateProfile controller: ", error?.message || error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

