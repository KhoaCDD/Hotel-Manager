var express = require('express');
var bodyParser = require('body-parser');
var cors =require('cors');
var router = require('./routes')();
var app = express();
var {auth} =require('./middleware/index');
require("dotenv").config();

var port = process.env.port;

app.listen(port, () => {
    console.log("Server up and running on "+port);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

 
app.use('/api',auth, router);


