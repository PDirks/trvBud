var path = require('path');
var express = require('express');
var app = express();

app.set('view engine', 'jade');

app.use('/js', express.static(__dirname + '/views/js'));
app.use('/css', express.static(__dirname + '/views/css'));

app.get('/', function(req, res){ 
    res.render('main.jade');
});

var server = app.listen(8080,function(){
    console.log("We have started our server on port ...");
    if (app.get('env') === 'development') {
        app.locals.pretty = true;
    }
});