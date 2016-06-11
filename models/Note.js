var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: {
    type:String,
    required: "Note Title is required"
  },
  body: {
    type:String,
    required: "Note Text is required"
  }
});

var Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
