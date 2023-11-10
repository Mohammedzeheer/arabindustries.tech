const express = require('express');
const userRouter = express.Router();
const userController=require('../controller/userController')
const upload = require('../middleware/photo');
const jwtUser = require('../middleware/userJWT');

userRouter.post('/login',userController.Login)
userRouter.post('/register',userController.Register)
userRouter.post('/profile',jwtUser,upload.array("image",10),userController.imageUpload)

module.exports = userRouter;
