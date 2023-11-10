const adminCollection = require('../model/adminModel')
const userCollection = require('../model/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


const Login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await adminCollection.findOne({ username });

        if (admin) {
            if (admin.password === password) {
                console.log("Logged in successfully");
                const token = jwt.sign({ sub: admin._id }, 'Key', { expiresIn: '3d' })
                res.json({ admin: true, token })
            } else {
                console.log("Invalid password");
                const errors = { username: 'Invalid password' }
                res.json({ errors, admin: false })
            }
        } else {
            console.log("Username not found");
            const errors = { username: 'Username not found' }
            res.json({ errors, admin: false })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during login" });
    }
};


const Register = async (req, res) => {
    try {
        let { username, password } = req.body;
        const checkusername = await adminCollection.find({ username: username });

        if (checkusername.length > 0) {
            const errors = { email: 'email already exists' };
            return res.status(400).json({ errors });
        }

        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (!usernameRegex.test(username)) {
            const errors = { username: 'Enter a valid username' };
            return res.status(400).json({ errors });
        }
        if (!passwordRegex.test(password)) {
            const errors = { password: 'Enter a valid password' };
            return res.status(400).json({ errors });
        }
        else {
            password = password ? await bcrypt.hash(password, 10) : null;
            const data = await adminCollection.insertMany({ username, password });
            res.status(201).json({ user: data });
        }
    } catch (error) {
        return res.status(500).json({ error, message: "Internal server error" });
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