const path = require('path');
const express = require('express');
const hbs = require('hbs');  //templating engine handlebar
const {MongoClient} = require('mongodb');
const {ObjectID} = require('mongodb');

const fileSystem = require(path.join(__dirname,'../public/js/fileSystem.js'));  //Read from file
const publicPath = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../views');

const port = process.env.PORT || 3000;      //port: heroku or local express app

//--- SETUP  APP ---
var app = express();
app.use( express.static( publicPath ) );    //static directory
app.set( 'view engine', 'hbs');              //setup Handlebar: view template engine and partials
hbs.registerPartials( viewsPath + '/partials' );
hbs.registerPartials( viewsPath + '/pageContent' )
app.listen( port, ()=>{console.log(`Server up on port ${port}`)});  //port

//--- SETUP DB --
MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
    if(err){
        return console.log(err);
    }
    var db = client.db('Todos');
    console.log('connected to DB');
    // db.collection('Todos').insertOne({
    //     text: 'Something todo',
    //     completed: false
    // }, (err, result)=>{
    //     if(err){
    //         return console.log('Unable to insert a Todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    // db.collection('Todos').find({completed:true}).toArray().then((docs)=>{
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err)=>{
    //     console.log('Unable to Fetch Todos', err);
    // })

    // db.collection('Todos').deleteMany({completed:false}).then((result)=>{
    //     console.log(JSON.stringify(result, undefined, 2));
    // }, (err)=>{
    //     console.log('Unable to Fetch Todos', err);
    // })

    // db.collection('Todos').findOneAndUpdate({_id: new ObjectID("5b54b0fbe7e7425a00140bba")},{
    //     $set: {completed:false}
    // },{returnOriginal:false}).then((result)=>{
    //     console.log(JSON.stringify(result, undefined, 2));
    // }, (err)=>{
    //     console.log('Unable to Fetch Todos', err);
    // })

    //client.close();
})


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