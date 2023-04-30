const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Create a new note
router.post('/notes', async (req, res) => {
  const { title, content } = req.body;
  try {
    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error('Failed to create note', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Get all notes
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    console.error('Failed to get notes', err);
    res.status(500).json({ error: 'Failed to get notes' });
  }
});

// Get a single note by ID
router.get('/note/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    console.error(`Failed to get note with ID ${id}`, err);
    res.status(500).json({ error: `Failed to get note with ID ${id}` });
  }
});

// Update a note by ID
router.put('/note/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(updatedNote);
  } catch (err) {
    console.error(`Failed to update note with ID ${id}`, err);
    res.status(500).json({ error: `Failed to update note with ID ${id}` });
  }
});

// Delete a note by ID
router.delete('/note/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error(`Failed to delete note with ID ${id}`, err);
    res.status(500).json({ error: `Failed to delete note with ID ${id}` });
  }
});

module.exports = router;
