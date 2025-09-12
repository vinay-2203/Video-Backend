const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../Model/User")
const userValidationSchema = require('../Validations/Validation')
const {ObjectId} = require('mongodb')
require('dotenv').config();



//Signup Route
router.post('/', async (req, res) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
        const errorMessages = error.details.map((e) => e.message);
        return res.status(400).json({ error: errorMessages });
    }
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.Password, saltRounds);
        const user = new User({
            ...req.body,
            Password: hashedPassword
        });
        await user.save();
        const token = jwt.sign(
            {id: user._id,Email:user.Email},
            process.env.JWT_SECRET,
            {expiresIn : '2d'}
        )
        res.status(201).json({ message: "Signup successful" ,token});
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "Email already exists"});
        }
        return res.status(500).json({ error: "Internal server error" });
    }
})

//Login Route

router.post('/login',async(req,res)=>{
    const {Email,Password} = req.body;

    try{
        const user = await User.findOne({Email});
        if(!user)
        {
            return res.status(401).json({message:"Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(Password,user.Password);
        if(!isMatch){
            return res.status(401).json({error:"Invalid Credentials"})
        }

        const token = jwt.sign(
            {id:user._id,Email:user.Email},
            process.env.JWT_SECRET,
            {expiresIn:'2d'}
        )
        res.status(201).json({message:"Login Successful",token});
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
})

router.get('/friend-data',async(req,res)=>{
    try{
        const Id = req.query.id;
        const user = await User.findById(Id);
        const data = {
            Name : user.Name,
            Number:user.Number
        }
        res.json(data);

    }catch(err){
        console.error(err);
    }
})


module.exports = router;