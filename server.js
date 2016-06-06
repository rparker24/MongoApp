var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var mongojs = require('mongojs');

var databaseUrl = "mongoHW";
var collections = ["articles"];
var db = mongojs(databaseUrl, collections);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));

db.on('error', function(err) {
  console.log('Database Error:', err);
});

app.get('/', function(req, res) {
  res.send(index.html);
});

app.get('/all', function(req, res) {
  db.articles.find({}, function(err, found) {
		if (err) {
			console.log(err);
		} else {
			res.json(found);
		}
	});
});

app.get('/scrape', function(req, res) {
  request('https://arstechnica.com', function (error, response, html) {

    var $ = cheerio.load(html);
    var result = [];
    $('h1.heading').each(function(i, element){

        var title = $(this).text();
        var link = $(element).parent().attr('href');
        var excerpt = $(this).parent().siblings('p.excerpt').text();

        db.scrapedData.insert({title: title, link: link}, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });

      });
  });

  res.send('Scrape Complete');

});
