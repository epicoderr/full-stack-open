const Personform = (props) => {
  return (
    <div>
      <form onSubmit={props.adder}>
        name: <input value={props.name} 
        onChange={props.namehandler}
        />
        <div>
          number: <input value={props.number} 
          onChange={props.numberhandler}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>   
    </div>
  )
}

export default Personform