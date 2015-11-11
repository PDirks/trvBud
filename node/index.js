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
var findCity = function(db, query, callback){
    var cursor = db.collection('city').find({AccentCity: query}).sort({Population:-1}).limit(5);
    cursor.each(function(err, doc){
        assert.equal(err, null);
        if( doc != null ){
            
            console.dir(doc);
            
        }
    });
}


/*
 *  routing
 **/
app.get('/getCity', function(req, res){
    var query = req.body.q;
    console.log("looking up: "+query);
    //res.json([{name: 'Chicago'}]);
    findCity(db, query, function(city_arr){
         res.json(city_ar);
    });
});

app.get('/', function(req, res){ 
    res.render('main.jade');
    console.log("[get]");
});

/*
 *  main server sequence
 **/
var port = process.env.PORT || 3000;
var host = process.env.HOST || '0.0.0.0';
var server = app.listen(port,function(){
    console.log("We have started our server on port "+port);
    if (app.get('env') === 'development') {
        app.locals.pretty = true;
    }
});