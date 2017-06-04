/*jshint node:true*/

// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/),
// and jade as template engine (http://jade-lang.com/).

// Setup DB2
///*eslint-env node */
//var db = require('/QOpenSys/QIBM/ProdData/Node/os400/db2i/lib/db2')
//db.init()
//db.conn('*LOCAL', function(){
//  db.autoCommit(true);
//});

var body_parser = require('body-parser');

var express = require('express');
// setup middleware
var app = express();
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.bodyParser());   // 2005-05-18 connect.multipart() will be removed in connect 3.0
app.use(express.urlencoded());   // 2005-05-18
app.use(express.json());         // 2005-05-18
app.use(app.router);
app.use(express.errorHandler());
app.use(express.static(__dirname + '/public')); //setup static public directory
app.set('view engine', 'jade');
app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views

// xmlservice
var XmlServiceProvider = require('./xmlserviceprovider').XmlServiceProvider;
var xmlserviceProvider= new XmlServiceProvider();

// Routes
app.get('/', function(req, res) {
     res.render('main');
});

// DB2
//app.get('/DB2Access', function(req, res) {
//    
//    try {
//        
//        var diskResults;
//        var sysResults;
//        var sysInfoResults;
//        
//        db.exec("SELECT * FROM SYSIBMADM.ENV_SYS_INFO", function(results) {
//        sysResults = results;
//        });
//        
//        db.exec("SELECT * FROM QSYS2.SYSTEM_STATUS_INFO", function(results) {
//        sysInfoResults = results;
//        });
//        
//        db.exec("SELECT UNIT_STORAGE_CAPACITY, PERCENT_USED FROM QSYS2.SYSDISKSTAT", function(results) {
//        res.render('node_db2', { title: 'Users',
//        diskResults: results, 
//        sysResults: sysResults,
//        sysInfoResults: sysInfoResults});
//        //console.log(results);
//        }); 
//    }
//    catch (err) {
//        console.log(err);
//    }
//    
//});

// XMLServices
app.get('/Toolkitfori', function(req, res) {  
  xmlserviceProvider.HatsCat(
    function(result) {
      res.render('index', { title: 'Please select hat group !!!', items: result } );
    }
    );
});

app.get('/cat', function(req, res) {
  var key = req.query.key;
  xmlserviceProvider.HatsPgmCat(
    function(result) {
      res.render('cat', { title: 'select your hats', items: result } );
    }
    , key);
});

app.get('/big', function(req, res) {
  var key = req.query.key;
  var chat = null;
  xmlserviceProvider.HatsDetail(
    function(result) {
      res.render('big', { title: 'hat information', item: result } );
    }
    , key, chat);
});

app.post('/big', function(req,res) {
  var key = req.body.prod;
  var chat = req.body.chat;
  xmlserviceProvider.HatsDetail(
    function(result) {
      res.render('big', { title: 'hat information', item: result } );
    }
    , key, chat);
});

// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
// TODO: Get service credentials and communicate with bluemix services.

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 60618);
// Start server
app.listen(port, function () {
  console.log('Running on port %d', port)
});
