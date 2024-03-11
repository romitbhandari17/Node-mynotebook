const express = require('express');
const router = express.Router();
const User = require("../models/Users")
const { body, query, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const fetchuser = require("../middleware/fetchuser");

//Route 1: Create a new User to the User Model - GET- No login required
router.post('/createuser', 
    body('name', 'Name cant be empty').notEmpty(),
    body('email', "Invalid Email").isEmail(),
    // password must be at least 5 chars long
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    async (req,res)=>{
        try{
            console.log("inside createuser endpoint");
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // find if duplicate email
            let user = await User.findOne({email:req.body.email})
            if(user){
                return res.status(400).json({"Error": "Sorry, A user with this email already exists!!"})
            }
            
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(req.body.password,salt);
            

            //create new user in users schema
            user = await User.create({
                email: req.body.email,
                password: secPassword,
                name: req.body.name,
                });

            const jwtData = {
                user:{
                    id:user.id
                }
            };

            var authToken = jwt.sign(jwtData, jwtSecret);
            //console.log(authToken)
            res.json({authToken});
        }
        catch(error){
            console.error(error.message);
            res.status(500).json({"Error":error.message});
        }
    }
)

//Route 2: Authenticate user - POST - No Login required
router.post('/login', 
    body('password', 'Password cant be empty').notEmpty(),
    body('email', "Invalid Email").isEmail(),
    async (req,res)=>{
        try{
            console.log("inside login endpoint");
            let success = false;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {email, password} = req.body;
            // find if email exists
            let user = await User.findOne({email})
            if(!user){
                return res.status(400).json({success:success, "Error": "Sorry, Wrong credentials, email"})
            }

            const compare =  await bcrypt.compare(password,user.password);

            if(!compare){
                return res.status(400).json({success:success, "Error": "Sorry, Wrong credentials, pass"})
            }

            const jwtData = {
                user:{
                    id:user.id
                }
            };

            console.log("secret=",jwtSecret)
            console.log("jwt data=",jwtData)
            success=true;
            var authToken = jwt.sign(jwtData, jwtSecret);
            //console.log(authToken)
            res.json({success:success, authToken:authToken});
        }
        catch(error){
            console.error(error.message);
            res.status(500).json({"Error":error.message});
        }
    }
)


//Route 3: Get user from auth token, POST - Login required
router.post('/getuser', fetchuser,
    async (req,res)=>{
        try{
            console.log("inside getuser endpoint");

            const userId = req.user.id;
            // find if email exists
            let user = await User.findById(userId).select("-password");
            if(!user){
                return res.status(400).json({"Error": "Sorry, Wrong auth token"})
            }

            res.json({user});
        }
        catch(error){
            console.error(error.message);
            res.status(500).json({"Error":error.message});
        }
    }
)


//Route 4: Add a new User to the User Model - GET, No login required
router.get('/createuser', 
    query('name', 'Name cant be empty').notEmpty(),
    query('email', "Invalid Email").isEmail(),
    // password must be at least 5 chars long
    query('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    (req,res)=>{
        console.log("inside GET endpoint")
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        User.create({
            email: req.query.email,
            password: req.query.password,
            name: req.query.name,
        }).then(user => res.json(user))
        .catch(err=>{console.log(err.message)
        res.json({'Error':err.message})});
})

module.exports = router;