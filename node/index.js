var path = require('path');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var md5 = require('md5');

/*
 *  set view engine to jade
 **/
app.set('view engine', 'jade');

/*
 *  set static assets
 **/
app.use('/js', express.static(__dirname + '/views/js'));
app.use('/css', express.static(__dirname + '/views/css'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


/*
 *  mongo db implement
 **/
mongoose.connect('mongodb://localhost/world');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("connected to mongo");
});

/*
 *  routing
 **/
app.get('/sCity', function(req, res, next){
    var query = req.query.q;
    console.log("(s)looking up: "+query);
    //res.json([{name: 'Chicago'}]);
    var cursor = db.collection('city').find({AccentCity: query}).sort({Population:-1}).limit(5);
    cursor.each(function(err, doc){
        if(err != null){
            console.dir("there was a get error");
            return;
        }
        if( doc != null ){
            //console.log(doc);
            return res.json(doc);
            
            /*
             * Magic that keeps the headers from crashing errything...
             **/
            /*
            var sent = false;
            res.json = function(doc){
                if(sent) return;
                console.log("sending...");
                _send.bind(res)(doc);
                sent = true;
            };
            next();
            */
        }
    });
});

app.get('/gCity', function(req, res, next){
    var query = req.query.q;
    //res.json([{name: 'Chicago'}]);
    console.log("get from db");
    if(query != null){
        
        var tokens = query.split(",")
        console.log("looking up: "+tokens[0]+"-"+tokens[1]+"-"+tokens[2]);
        
        if( tokens[1] == null &&tokens[2] == null ){
            db.collection('city').find({AccentCity: tokens[0], $where: "this.Population!=\"\""}).sort({Population:-1}).limit(1).toArray(function(err, docs){
           if(err || docs[0] == null) {
                console.log("err: "+err);
           }
            else{
                console.log("got "+docs[0].AccentCity+" "+docs[0].Region+", "+docs[0].Country.toUpperCase()+" ("+ docs[0].Latitude+","+docs[0].Longitude+")");
                res.json({ 
                    AccentCity: docs[0].AccentCity, 
                    Country: docs[0].Country.toUpperCase(),
                    Latitude: docs[0].Latitude,
                    Longitude: docs[0].Longitude,
                    Region: docs[0].Region,
                    id: docs[0]._id
                })
            }
            
        });
        }
        else{        
            db.collection('city').find({AccentCity: tokens[0], Region: tokens[1], Country: tokens[2], $where: "this.Population!=\"\""}).sort({Population:-1}).limit(1).toArray(function(err, docs){
               if(err || docs[0] == null) {
                    console.log("err: "+err);
                    res.status(404).send("get city error!");
               }
                else{
                    console.log("got "+docs[0].AccentCity+" "+docs[0].Region+", "+docs[0].Country.toUpperCase()+" ("+ docs[0].Latitude+","+docs[0].Longitude+")");
                    res.json({ 
                        AccentCity: docs[0].AccentCity, 
                        Country: docs[0].Country.toUpperCase(),
                        Latitude: docs[0].Latitude,
                        Longitude: docs[0].Longitude,
                        Region: docs[0].Region,
                        id: docs[0]._id
                    })
                }
            });
        }
        
    }
                
});

app.post('/saveTrip', function(req, res){
    console.log("[post]")
    console.log(req.body.q);
    //var input = JSON.parse(req.body.q);
    var input = req.body.q;
    //console.log( "[post] itin: "+input);
    
    var temp = md5( input + new Date().getTime() );
    var key = temp.substr(temp.length - 5);
    console.log("[/saveTrip] "+temp+", "+key);
    
    // collision check
    /*
    while( db.collection("trip").find({key: key}).count()  0 ){
        var temp = md5( input + new Date().getTime() );
        var key = temp.substr(temp.length - 5);
        console.log("[/saveTrip] collision! new key: "+key);
    }
    */
    var dat_insert = {
        "itin": input,
        "key": key
    };
    
    db.collection("trip").insert( dat_insert, null, function(err, data){
        if( err != null ){
            console.log("[/saveTrip] insert error: "+err);
        }
    });
    
    db.collection("trip").find({ "key": key }).toArray(function(err, docs){
        if( err != null ){
            console.log("[/saveTrip] find error: "+err);
        }
        else{
            console.log("[/saveTrip] packed up: "+docs[0].itin+", "+docs[0].key);
            res.json({key:docs[0].key});
        }
    });
    
    //res.redirect(200,"/review?data="+dat_insert);
    //res.redirect("http://google.com");
    
});// end /saveTrip

app.get('/review', function(req,res){
    var key = req.query.key;
    console.log("[review] "+key+" / "+req.query.key);
    var iten_dat;
    db.collection("trip").find({"key": key}).limit(1).toArray(function(err, docs){
        console.log("[review] loading up "+docs[0].itin);
        if(err) {
            console.log("err: "+err);
            res.status(404).send("get city error!");
        }
        else{
            res.render('review.jade', {places:JSON.parse(docs[0].itin)});    
        }
    });
    
    
})


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