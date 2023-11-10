const adminCollection = require('../model/adminModel')
const userCollection = require('../model/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')





const Register = async (req, res) => {
    try {
        let { username, password } = req.body;
        const checkusername = await adminCollection.find({ username: username });

        if (checkusername.length > 0) {
            return res.status(400).json({ message: 'username already exists' });
        }

        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (!usernameRegex.test(username)) {
            return res.status(400).json({ message: 'Enter a valid username' });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Enter a valid password'});
        }
        else {
            password = password ? await bcrypt.hash(password, 10) : null;
            const data = await adminCollection.insertMany({ username, password });
            res.status(201).json({ user: data });
        }
    } catch (error) {
        return res.status(500).json({error, message: "Internal server error" });
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
        const user = await adminCollection.findOne({ username: username });      
        if (!user) {
            return res.status(401).json({message:'Incorrect username'});
        }  
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.status(401).json({ message:'Incorrect password'});
        }      
        const token = jwt.sign({ id: user._id }, process.env.ADMIN_TOKEN_SECRET, { expiresIn: '3d' });
        res.json({ login: true, token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const UsersList = async (req, res) => {
    try {
        let data = await userCollection.find({})
        if (data) {
            res.status(200).json({ data });
        } else {
            res.status(404).json({ message: "Users are  not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }

}



module.exports = { Register, Login, UsersList}