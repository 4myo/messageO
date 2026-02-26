import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";

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
           await newUser.save();
           res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            profilePic: newUser.profilePic,
           });

        }else {

            res.status(400).json({message: "Invalid user data"});
        }

//todo : send email for confirmation

    } catch (error) {
        console.log("Error in signup controller: ", error?.message || error);
        res.status(500).json({error: "Internal Server Error"});
    }

    
};
