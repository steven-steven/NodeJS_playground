const path = require('path');
const express = require('express');
const hbs = require('hbs');  //templating engine handlebar
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');

require('./config/config');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const fileSystem = require(path.join(__dirname,'../public/js/fileSystem.js'));  //Read from file
const publicPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../views');

const port = process.env.PORT;      //port: heroku or local express app

//--- SETUP  APP ---
var app = express();
app.use( express.static( publicPath ) );    //static directory
app.use( bodyParser.json() );     //parse client's json before giving to request
app.set( 'view engine', 'hbs');              //setup Handlebar: view template engine and partials
hbs.registerPartials( viewsPath + '/partials' );
hbs.registerPartials( viewsPath + '/pageContent' )
app.listen( port, ()=>{console.log(`Server up on port ${port}`)});  //port

//--- SETUP DB --


//--- Request Handler ---
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

//REST API
app.post('/todos', (req, res)=>{
    let todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({
            todos
        });
    }, (err) =>{
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res)=>{

    var id = req.params.id
    //handle incorrect object id format
    if(!ObjectId.isValid(id)){
        res.status(404).send();
    }

    Todo.findById(id).then((todo)=>{
        //handle incorrect id (return [] or null)
        if(!todo){
            res.status(404).send();
        }
        res.send({todo});
        
    }).catch((e)=>{
        res.status(404).send();
    });
});

app.delete('/todos/:id', (req, res)=>{
    var id = req.params.id;
    //handle incorrect object id format
    if(!ObjectId.isValid(id)){
        res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo)=>{
        //handle incorrect id (return [] or null)
        if(!todo){
            res.status(404).send();
        }
        res.send({todo});
        
    }).catch((e)=>{
        res.status(404).send();
    });
    
});

app.patch('/todos/:id', (req, res)=>{
    var id = req.params.id;
    //handle incorrect object id format
    if(!ObjectId.isValid(id)){
        res.status(404).send();
    }

    //pick only 'updatable' properties from request
    let body = _.pick(req.body, ['text','completed']);
    if(_.isBoolean(body.completed) && body.completed){  //user just set completed
        body.completedAt = new Date().getTime();    //timestamp
    } else{
        body.completed = false;         //set to default
        body.completedAt = null;
    }

    //Update to DB
    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true   //returned modified  rather than the original
    }).then((todo) => {
        //handle incorrect id (return [] or null)
        if(!todo){
            res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(404).send();
    })
    
});


module.exports = {app};