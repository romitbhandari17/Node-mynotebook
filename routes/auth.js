const express = require('express');
const router = express.Router();
const User = require("../models/Users")
const { body, query, validationResult } = require('express-validator');

//Add a new User to the User Model - POST
router.post('/createuser', 
    body('name', 'Name cant be empty').notEmpty(),
    body('email', "Invalid Email").isEmail(),
    // password must be at least 5 chars long
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    async (req,res)=>{
        try{
            console.log("inside POST endpoint");
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // find if duplicate email
            let user = await User.findOne({email:req.body.email})
            if(user){
                return res.status(400).json({"Error": "Sorry, A user with this email already exists!!"})
            }
            
            //create new user in users schema
            user = await User.create({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                });

            res.json(user);
        }
        catch(error){
            console.error(error.message);
            res.status(500).json({"Error":error.message});
        }
    }
)

//Add a new User to the User Model - GET
router.get('/', 
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