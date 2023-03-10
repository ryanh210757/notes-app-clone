import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

/**
 * Challenge: Spend 10-20+ minutes reading through the code
 * and trying to understand how it's currently working. Spend
 * as much time as you need to feel confident that you 
 * understand the existing code (although you don't need
 * to fully understand everything to move on)
 */


//initializes notes state with localStorage
export default function App() {
    const [notes, setNotes] = React.useState(JSON.parse(localStorage.getItem("note")) || [])
    const [currentNoteId, setCurrentNoteId] = React.useState(
       () => (notes[0] && notes[0].id) || ""
    )

    //saves to local storage when notes array changes
    React.useEffect(() => {
        localStorage.setItem("note", JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    

    function updateNote(text) {
        // Put the most recently-modified note at the top
        setNotes(prev => {
            const newArray = []
            for(let i = 0; i < prev.length; i++){
                const prevIndex = prev[i]
                if(prevIndex.id === currentNoteId){
                    newArray.unshift({...prevIndex, body: text})
                }else{
                    newArray.push(prevIndex)
                }
            }
            return newArray
        })
    }

    function deleteNote(event, noteId) {
        event.stopPropagation()
        setNotes(prev => prev.filter(item => item.id !== noteId))
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
