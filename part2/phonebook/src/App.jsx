import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Personform from './components/Personform'
import Notification from './components/Notification'
import nameService from './services/names'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    nameService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const showMessage = (message, type) => {
    setMessage(message)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  function addPerson(event) {
    event.preventDefault()

    const existingName = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingName) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const changedPerson = {
          ...existingName,
          number: newNumber
        }

        nameService
          .update(existingName.id, changedPerson)
          .then(response => {
            setPersons(persons.map(p => 
              p.id !== existingName.id ? p : response
            ))
            setNewName('')
            setNewNumber('')
            showMessage(`Changed number for ${response.name}`, 'success')
          })
          .catch(error => {
            if (error.response && error.response.data.error) {
              showMessage(error.response.data.error, 'error')
            } else {
            showMessage(
              `Information of ${existingName.name} has already been removed from server`,
              'error'
            )
            setPersons(persons.filter(p => p.id !== existingName.id))
          }
        })
    }    
      return
    }

    const nameObject = {
      name: newName,
      number: newNumber
    }

    nameService
      .create(nameObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
        showMessage(`Added ${response.name}`, 'success')
      })
      .catch(error => {
        showMessage(error.response.data.error, 'error')
      })
  }

  const deletePerson = (person) => {
    const ok = window.confirm(`Delete ${person.name}?`)

    if (ok) {
      nameService
        .getRid(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          showMessage(`Deleted ${person.name}`, 'success')
        })
        .catch(error => {
          showMessage(
            `The person '${person.name}' was already deleted from server`,
            'error'
          )
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const peopleToShow = persons.filter(person => 
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <Filter filter={newFilter} handler={handleFilterChange} />

      <h3>Add a new</h3>

      <Personform
        adder={addPerson}
        name={newName}
        namehandler={handleNameChange}
        number={newNumber}
        numberhandler={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons mapper={peopleToShow} deleter={deletePerson} />
    </div>
  )
}

export default App