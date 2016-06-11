var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: "Article title is required"
  },
  link: {
    type: String,
    unique: true,
    required: "Article link is required"
  },
  excerpt: {
    type: String,
    unique: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }
});

var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;
