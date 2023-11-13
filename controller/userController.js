const userCollection = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cloudinary = require('../helpers/cloudinary')

const Register = async (req, res) => {
    try {
      let { username, email, password } = req.query || req.body ;

      const checkusername = await userCollection.find({ username: username });
      if (checkusername.length>0) {
        return res.status(400).json({ message:`username already exists`});
      }
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Enter a valid username' });
      } 
      if (!emailRegex.test(email)) {
        return res.status(400).json({message: 'Enter a valid email'});
      }
      if (!passwordRegex.test(password)) {
        return res.status(400).json({message: 'Enter a valid password'});
      }  
      else {
        password = password ? await bcrypt.hash(password, 10) : null;
        const data = await userCollection.insertMany([{ username, email, password }]);
        res.status(201).json({ user: data});
      }
    } catch (error) {
      return res.status(500).json({ error, message: "Internal server error" });
    }
  };
  


const Login = async (req, res) => {
    try {
        let { username, password } = req.query || req.body ;
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
        const {userId}=req.query || req.body

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



