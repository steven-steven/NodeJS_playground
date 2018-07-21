const fs = require('fs');
const path = require('path');

filePath = path.join(__dirname,'../resource/sample.json');


//Helper functions
let fetchNotes = () => {
    try{
        let notes = JSON.parse(fs.readFileSync(filePath));
        return notes;
    }catch(e){
        return [];
        //console.log("Unable to fetch contents: ",e);    //no return = undefined
    }
}

var saveNotes = (notes) => {
    fs.writeFileSync(filePath, JSON.stringify(notes));
};

//Interface functions
var getAll = () => {
    return fetchNotes();
};

let addNote = (title, description) => {
    let notes = fetchNotes();
    let note = {
        title,
        description
    };
    
    //push if no duplicate
    let duplicateNotes = notes.filter((note)=>note.title === title);
    if(duplicateNotes.length === 0){
        notes.push(note);
        saveNotes(notes);
        return note;
    }else{
        console.log("Duplicate")
    }
}

let removeNote = (title) => {
    let notes = fetchNotes();
    let filteredNotes = notes.filter((note) => note.title !== title);
    saveNotes(filteredNotes);

    return notes.length !== filteredNotes.length;   //return true if removed
};
  
module.exports = {
    addNote,
    getAll,
    removeNote
};