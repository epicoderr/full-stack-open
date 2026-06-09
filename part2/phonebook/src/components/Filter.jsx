const Filter = (props) => {
  return (
  <div>
    filter shown with 
    <input 
      value={props.filter}
      onChange={props.handler}
    />
  </div>
  )
}

export default Filter