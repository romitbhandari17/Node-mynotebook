const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes")
const { body, validationResult } = require('express-validator');

//Route 1: Fetch all notes for a user - GET- login required
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    
    console.log("inside fetchallnotes endpoint");
    const notes = await Notes.find({user:req.user.id});

    res.json({notes});
})


//Route 2: Add a note for a user - POST- login required
router.post('/addnote',fetchuser, [
    body('title', 'Title cant be empty').notEmpty(),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })],
    async (req,res)=>{
    console.log("inside addnote endpoint");
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {title,description, tag} = req.body;
        const note = await Notes.create({title:title, description:description, tag:tag, user:req.user.id});

        res.json({note});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({"Error":error.message});
    }
    
})

//Route 3: Update a note for a user - PUT- login required
router.put('/updatenote/:id',fetchuser,
    async (req,res)=>{
    console.log("inside updatenote endpoint");
    try{
        const {title,description, tag} = req.body;
        let note = await Notes.findById(req.params.id);

        if(!note){
            return res.status(400).send("Note not found");
        }

        if(req.user.id !== note.user.toString()){
            return res.status(401).send("Wrong user");
        }

        const newNote={};
        if(title) newNote.title = title;
        if(description) newNote.description = description;
        if(tag) newNote.tag = tag;

        note = await Notes.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true});
        res.json({note});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({"Error":error.message});
    }  
})

//Route 4: Delete a note for a user - DELETE- login required
router.delete('/deletenote/:id',fetchuser,
    async (req,res)=>{
    console.log("inside deletenote endpoint");
    try{
        let note = await Notes.findById(req.params.id);

        if(!note){
            return res.status(400).send("Note not found");
        }

        if(req.user.id !== note.user.toString()){
            return res.status(401).send("Wrong user");
        }

        note = await Notes.findByIdAndDelete(req.params.id);

        res.json({"Success": "Note Deleted", note:note});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({"Error":error.message});
    }  
})

module.exports = router;