
import UserModel from "../models/Users.js";
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt-nodejs'


const addUser = async (req , res) =>{
    try {
        const { name, userName , email , password } = req.body;
        const newUser = new UserModel({
            userName: name || userName, 
            email,
            password
        })

        const savedUser = await newUser.save();
        res.json({ success: true, message: "Admin added successfully", user: savedUser });
    } catch (error) {
        console.log("User added Error : " + error);
        res.json({ success: false, message: "Error adding admin: " + error });
    }


}


const getAllusers = async ( req , res) =>{
    try {
        const users  = await UserModel.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        
    }
}

const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const payload = { subject: user._id };
      const token = jwt.encode(payload, '12345');
      return res.json({ message: "Login Successful", user: user, token: token });
    });

  } catch (error) {
    console.log("Login Error: " + error);
    res.status(500).json({ message: "Server error" });
  }
}



export { addUser , getAllusers , UserLogin };