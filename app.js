const express = require('express');
const mongoose = require('mongoose');
const User = require("./models/user.js");
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.listen(3000);
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/authtestapp')
    .then(() => console.log('Connected!'));

app.get("/", (req, res) => {
    console.log("running");
    res.render('index.ejs');
}
);
//create route;//sign in
app.post("/create", (req, res) => {
    let { username, email, password } = req.body;
    //bcrypt
    bcrypt.hash(password, 10, (err, hash) => {
        if (hash) {
            let newUser = new User(
                {
                    username: username,
                    email: email,
                    password: hash,
                }
            )
            newUser.save();
            let token = jwt.sign({ email }, "secretkeyhihi");
            res.cookie("token", token);
            res.send("user");




        }
        else throw err;
    })

})
//login
app.get("/login",(req,res)=>{
      res.render('login.ejs');
})
app.get("/logout",(req,res)=>{
      //token remove
      res.cookie("token","");
      res.redirect('/'); //cookie deleted

})
app.post("/login",async (req,res)=>{
 let user=  await User.findOne({email: req.body.email});
 console.log(user.password,req.body.password);
 //hashed password
//and password from user while login

//compare whether these two matches
bcrypt.compare(req.body.password,user.password,(err,result)=>{
   if(result){
    let token = jwt.sign({email: user.email }, "secretkeyhihi");
    res.cookie("token", token);
    res.send("yes you can login");
   }  
   else res.send("something went wrong please check email or password");
})
})