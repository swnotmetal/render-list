import Note from './components/Note'
import { useState, useEffect } from 'react'
import React from 'react'
import noteService from './services/notes'

const Footer =() => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2023, written by Shuang Wu</em>

    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState(
    ''
  )
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
 

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }
  
    noteService
        .create(noteObject)
        .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
    })
  }

   /* setNotes(notes.concat(noteObject))
    setNewNote('')*/
    const toggleImportanceOf = id => {
      const url = `http://localhost:3001/api/notes/${id}`
      const note = notes.find(n => n.id === id)
      const changedNote = {...note, important: !note.important}
  
      noteService
        .update(id, changedNote)
        .then (returnedNote=> {
          setNotes(notes.map(note => note.id !== id ?note : returnedNote))
        })
        .catch(error => {
          setErrorMessage(
            `the note '${note.content}' was already deleted from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000);
          setNotes(notes.filter(n => n.id !== id))
        })
     
    }
  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  // condition ? exprIfTrue : exprIfFalse
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll? 'important': 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} 
                note={note}
                toggleImportance={() => toggleImportanceOf(note.id)}  />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type='submit'>save</button>
      </form>
      <Footer />
    </div>
  )    
}

export default App