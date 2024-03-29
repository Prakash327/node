  const asyncHandler= require("express-async-handler")
  const bcrypt = require("bcrypt")
  const jwt = require('jsonwebtoken')
  const User = require('../models/userModel')


//   @desc Register a user
//   @route POST /api/users/Register
//   @access public

const registerUser = asyncHandler(async(req,res)=>{
    const {username,email, password}=req.body;
    if(!username||!email||!password){
        res.status(400)
        res.json({message:"All fields are mandatory"})
    }
    const userAavailable = await User.findOne({email})
    if(userAavailable){
        res.status(400)
        res.json({message:"user already registered"})
    }
    //hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password,10);
    console.log("Hashed Password:",hashedPassword)
    const user = await User.create({
        username,
        email,
        password:hashedPassword,
    })

    console.log(`user created${user}`)
    if(user){
        res.status(201).json({_id:user.id,email:user.email})
    }else{
        res.status(400)
        throw new error("User data is invalid")
    }
    res.json({message:"User registered"})
})
//   @desc login a user
//   @route POST /api/users/Register
//   @access public
const loginUser = asyncHandler(async(req,res)=>{
const {email, password}= req.body;
if(!email|| !password){
    res.status(400);
    throw new Error({message:"All fields are required"})
}
//c
const user = await User.findOne({email});
//compare password withh hashed password
if(user && (await bcrypt.compare(password,user.password))){
   const accessToken = jwt.sign({
    user:{
        username:user.username,
        email : user.email,
        id :user.id,
    }
   },process.env.jwt_secret||"prakash123",{expiresIn:"20m"})
    res.status(200).json({accessToken});
    console.log("your token is::::",accessToken)
}else{
    res.status(400)
    throw new Error("email  || password not valid")
}

    // res.json({message:'Login user'})
})

//   @desc current user info
//   @route POST /api/users/Register
//   @access private
const currentUser= asyncHandler(async(req,res)=>{
res.json(req.user);
})
module.exports = {registerUser,loginUser,currentUser}