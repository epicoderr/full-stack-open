const Persons = (props) => {
  return (
  <div>
    {props.mapper.map(person => 
      <div key={person.id}>
        <p>
          {person.name} {person.number}{' '}
          <button type="button" onClick={() => props.deleter(person)}>delete</button>
        </p>
      </div>
    )}
  </div>
  )
}

export default Persons