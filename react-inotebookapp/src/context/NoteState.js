import { useState } from 'react';
import NoteContext from './noteContext';

const NoteState = (props) => {
    const host = "http://localhost:5000";
    const notesInitial = []

    const getNotes = async () =>{
    const response =  await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem("token")
        }
    });
    const data = await response.json();
    console.log(data)
    setNotes(data);
    }

    const [notes, setNotes] = useState(notesInitial)

    // Add a Note
    const addNote = async (title, description, tag) => {
        // TODO: API Call
        // API Call 
        const response =  await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("token")
            },
            body: JSON.stringify({title, description, tag})
        });
        const data = await response.json();
        console.log(data)
        setNotes(notes.concat(data));
    }

    //Delete a Note
    const deleteNote = async (id) => {

        const response =  await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("token")
            }
        });
        const data = await response.json();
        console.log("Delete API=>" + data)
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes);
        console.log(newNotes);
    }

    //Edit a Note
    const editNote = async (id, title, description, tag) => {

        const response =  await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("token")
            },
            body: JSON.stringify({title, description, tag})
        });
        const data = await response.json();
        console.log("editing---"+ data)
        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                element.title = title;
                element.description = description;
                element.tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    }

    return (
        <NoteContext.Provider value={{ notes, setNotes, getNotes, addNote, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;