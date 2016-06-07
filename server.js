var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));

// DB Config
mongoose.connect('mongodb://localhost/MongoArticles');
var db = mongoose.connection;

db.on('error', function (err) {
console.log('Mongoose Error: ', err);
});
db.once('open', function () {
console.log('Mongoose connection successful.');
});

//Require Schemas
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

// Routes
app.get('/', function(req, res) {
  res.send(index.html);
});

app.get('/scrape', function(req, res) {
  request('https://arstechnica.com', function (error, response, html) {

    var $ = cheerio.load(html);
    var result = [];
    $('h1.heading').each(function(i, element){

      var title = $(this).text();
      var link = $(element).parent().attr('href');
      var excerpt = $(this).parent().siblings('p.excerpt').text();

			var entry = new Article (result);

      entry.insert(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    });
  });
  res.send('Scrape Complete');
});

app.get('/articles', function(req, res) {
  db.articles.find({}, function(err, found) {
		if (err) {
			console.log(err);
		} else {
			res.json(found);
		}
	});
});

app.get('/articles/:id', function(req, res) {
	Article.findOne({'_id': req.params.id})
		.populate('note')
		.exec(function(err, doc) {
			if (err) {
				console.log(err);
			} else {
				res.json(doc);
			}
		});
});

app.post('/articles/:id', function(req, res) {
	var newNote = new Note(req.body);

	newNote.insert(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id},
			{'note': doc._id});
			.exec(function(err, doc) {
				if (err) {
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});

app.listen(3000, function() {
	console.log('App running on port 3000!');
});
