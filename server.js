var express = require('express');
var app = express();
var expressLayouts = require('express-ejs-layouts');
var http = require('http');

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(express.static('public'));

var APIkey = '9a448cb3ffed441801362492ef3114d8';
var units = 'metric';

app.get('/', function(req, res){
  res.redirect('/weather');
});


app.get('/weather', function(req, res){
  res.render('weather');
});

app.get('/weather/:city', function(req, res){
  http.get('http://api.openweathermap.org/data/2.5/weather?q=' + req.params.city + '&appid=' + APIkey + '&units=' + units, function(response){
    var body = '';                                                                                                                        
    response.on('data', function(d){
      body += d;                                                                                                                          
    });
    response.on('end', function(){                                                                                                        
      res.send(JSON.parse(body));
    });
  });
});

app.get('/weather/geolocation/:latlng', function(req, res){
  var latlng = JSON.parse(req.params.latlng);
  http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + latlng.lat + '&lon=' + latlng.lng + '&appid=' + APIkey + '&units=' + units, function(response){
    var body = '';                                                                                                                        
    response.on('data', function(d){
      body += d;                                                                                                                          
    });
    response.on('end', function(){                                                                                                        
      res.send(JSON.parse(body));
    });
  });
});

app.listen('3000', function(){
  console.log('App started on port 3000, access the page by browsing to http://localhost:3000');
});
