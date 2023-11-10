const userCollection = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cloudinary = require('../helpers/cloudinary')

const Register = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      userdata = {
        username: username,
        email: email,
        password: password
      }
  
      const checkusername = await userCollection.find({ username: username });
  
      if (checkusername.length > 0) {
        const errors = { email: 'email already exists' };
        return res.status(400).json({ errors});
      }
  
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!usernameRegex.test(username)) {
        const errors = { username: 'Enter a valid username' };
        return res.status(400).json({ errors});
      } 
      if (!passwordRegex.test(password)) {
        const errors = { password: 'Enter a valid password' };
        return res.status(400).json({ errors});
      } 
      if (!emailRegex.test(email)) {
        const errors = { email: 'Enter a valid email' };
        return res.status(400).json({ errors});
      } else {
        password = password ? await bcrypt.hash(password, 10) : null;
        const data = await userCollection.insertMany([{ username, email, password }]);
        res.status(201).json({ user: data});
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error, message: "Internal server error" });
    }
  };
  


const Login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(username == '' || password=='') {
          return res.status(400).json({message:'Empty Field'});
        }
        else if (username === undefined) {
            return res.status(400).json({message:'username required'});
        } else if (password === undefined) {
            return res.status(400).json({ message:'Password required'});
        }       
        const user = await userCollection.findOne({ username: username });      
        if (!user) {
            return res.status(401).json({message:'Incorrect username'});
        }  
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.status(401).json({ message:'Incorrect password'});
        }      
        const token = jwt.sign({ id: user._id }, process.env.USER_TOKEN_SECRET, { expiresIn: '3d' });
        res.json({ login: true, token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};



const imageUpload= async (req,res,next)=>{
    try{
        const {userId}=req.body

        const files = req.files?.map((file) => file.path);
        const cloudinaryUploadPromises = files.map((filePath) =>
          cloudinary.uploader.upload(filePath)
        );
    
        const cloudinaryResults = await Promise.all(cloudinaryUploadPromises);
        const images = cloudinaryResults.map((result) => result.secure_url);

        let data=await userCollection.updateOne({_id:userId},{$set:{image:images}})
          res.json({status:true,data})   
    }catch(error){
        res.status(500).json({message: 'Internal Server Error' });
 
    }
}

module.exports = { Login, Register, imageUpload };



