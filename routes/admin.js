const express = require('express');
const AdminRouter = express.Router();
const adminController = require('../controller/adminController');
const jwtAdmin = require('../middleware/adminJWT');

AdminRouter.post('/',adminController.Login)
userRouter.post('/register',adminController.Register)
AdminRouter.post('/adminhome',jwtAdmin,adminController.UsersList)

module.exports = AdminRouter;
