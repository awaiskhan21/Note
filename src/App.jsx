import { useState, useEffect } from 'react'
import Note from "./component/Note"
import noteService from "./services/notes"
import Notification from './component/Notification'

// const App = (props) => {
//   const [notes , setNotes] = useState(props.notes)

const Footer = () =>{
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return(
    <div style={footerStyle}>
      <br/>
      <em>Note App , Awais A. Khan</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNotes , setNewNotes] = useState("")
  const [showAll , setShowAll] = useState(true)
  const [errorMessage , setErrorMessage] = useState("some error happend")

  useEffect(() => {
  console.log('effect')
  noteService
    .getAll()
    .then(initialNodes => {
      setNotes(initialNodes)
    })},[])

  // console.log('render', notes.length, 'notes')


  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNotes,
      important: Math.random() < 0.5,
    }

    noteService.create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote.data))
        setNewNotes('')
      })
  }
//toggling the importance of notes

  const toggleImportanceTo = (id) =>{

    const noteToChange = notes.find(n => n.id === id)
    const changedNote = {...noteToChange , important : !noteToChange.important }

    noteService
    .update(id ,changedNote ).then(returnedNote => {
      setNotes(notes.map(n=> n.id !== id ? n : returnedNote))
    })
    .catch(error =>{
      setErrorMessage(
        `note ${noteToChange.content} is removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const handleNotesChanges = (event) => {
    console.log(event.target.value)
    setNewNotes(event.target.value)
  }
  return (
    
    <div>
      <h1>Notes</h1>
      <Notification  message={errorMessage} />
      <button onClick={() => setShowAll(!showAll)} > 
        show {showAll ?   'important' :'all'}  
      </button>
      <ul>
        {notesToShow.map( x =>
        <Note key={x.id} note={x} toggleImportance={() => toggleImportanceTo(x.id)} />
        )}
      </ul>
      <form onSubmit={addNote} >
        <input type = {newNotes} onChange={handleNotesChanges}
        />
        <button value="submit">save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App