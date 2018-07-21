const path = require('path');
const express = require('express');
const hbs = require('hbs');  //templating engine handlebar
const fileSystem = require(path.join(__dirname,'../public/js/fileSystem.js'));

const publicPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../views');

//setup express
var app = express();
//setup static directory
app.use( express.static( publicPath ) );

//setup Handlebar: view template engine and partials
app.set( 'view engine', 'hbs');
hbs.registerPartials( viewsPath + '/partials' );
hbs.registerPartials( viewsPath + '/pageContent' )

//setup heroku
const port = process.env.PORT || 3000;

app.listen( port, ()=>{console.log(`Server up on port ${port}`)});

//handle page requests
app.get('/', (req, res)=>{
    res.render('index.hbs', {
        pageTitle: "Home",
        pageBlurb: "Bootstrap Playground",
        whichPartial: function() {
            return "homepage";
        }
    });
});

app.get('/fileSystem', (req, res)=>{
    let allContents = fileSystem.getAll();

    res.render('index.hbs', {
        pageTitle: "File System",
        pageBlurb: "Dynamically reads data from local file and displaying them",
        whichPartial: function() {
            return "fileSystemPage";
        },
        fileArray : allContents
    });
});

app.get('/database', (req, res)=>{
    let allContents = fileSystem.getAll();

    res.render('index.hbs', {
        pageTitle: "Database Storage",
        pageBlurb: "Keep track of progress and store it in the database",
        whichPartial: function() {
            return "databasePage";
        }
    });
});