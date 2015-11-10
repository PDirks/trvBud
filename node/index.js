var path = require('path');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

/*
 *  set view engine to jade
 **/
app.set('view engine', 'jade');

/*
 *  set static assets
 **/
app.use('/js', express.static(__dirname + '/views/js'));
app.use('/css', express.static(__dirname + '/views/css'));

/*
 *  mongo db implement
 **/
mongoose.connect('mongodb://localhost/world');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("connected to mongo")
});

/*
 *  routing
 **/
app.get('/', function(req, res){ 
    res.render('main.jade');
});

/*
 *  main server sequence
 **/
var server = app.listen(8080,function(){
    console.log("We have started our server on port ...");
    if (app.get('env') === 'development') {
        app.locals.pretty = true;
    }
});