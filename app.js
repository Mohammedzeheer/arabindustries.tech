const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose= require('mongoose')
const cors = require('cors')

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST",'PUT','DELETE'],
  credentials: true
}))

app.use('/admin', adminRouter);
app.use('/', userRouter);

mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1:27017/arab', {useNewUrlParser: true})
.then(() => {
  console.log("Database Connected");
}).catch((error) => {
  console.log(error.message)
})


app.listen(4000, () => {
  console.log("Server is running");
});

module.exports = app;
