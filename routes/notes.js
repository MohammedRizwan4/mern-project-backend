const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// Route 1 Get all notes 
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        return res.json(notes);
    } catch (error) {
        return res.status(400).json({ error: "Internal server Error" });
    }
})

// Route 2 Create notes using post
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid name ').isLength({ min: 5 })
], async (req, res) => {
    const { title, description, tag } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save();
        return res.send(savedNote);
    } catch (error) {
        return res.status(400).json({ error: "Internal server Error" });
    }
})

// Route 2 Update existing notes using post
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //create new note Object
        const newNote = {}
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }
        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }
        
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        return res.json({ note });
    } catch (error) {
        return res.status(400).json({ error: "Internal server Error" });
    }
})

// Route 3 Delete existing notes using delete
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find the note to be deletd and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }
        // Allow deletion if user owns this
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        return res.json({ "Success": "Note has been deleted" ,note });
    } catch (error) {
        return res.status(400).json({ error: "Internal server Error" });
    }
})
module.exports = router;