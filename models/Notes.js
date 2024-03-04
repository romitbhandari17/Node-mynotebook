const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    title: {
        type: String, // String is shorthand for {type: String}
        required: true,
    },
    description: {
        type: String, // String is shorthand for {type: String}
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    }
  });

  module.exports= mongoose.model('notes', NotesSchema);