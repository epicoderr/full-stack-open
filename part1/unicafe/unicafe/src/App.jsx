import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const Statisticsline = ({ name, number }) => (
  <tr>
    <td>{name}</td>
    <td>{number}</td>
  </tr>
)

const Statistics = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <Statisticsline name='good' number={props.good} />
        <Statisticsline name='neutral' number={props.neutral} />
        <Statisticsline name='bad' number={props.bad} />
        <Statisticsline name='all' number={props.good + props.neutral + props.bad} />
        <Statisticsline name='average' number={(props.good - props.bad) / (props.good + props.neutral + props.bad)} />
        <Statisticsline name='positive' number={((props.good / (props.good + props.neutral + props.bad)) * 100) + '%'} />
      </tbody>
   </table>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleGoodClick = () => {
    setGood(good + 1)
    setAll(allClicks.concat('g')) 
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(allClicks.concat('n')) 
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setAll(allClicks.concat('b')) 
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text={'good'} />
      <Button onClick={handleNeutralClick} text={'neutral'} />
      <Button onClick={handleBadClick} text={'bad'} />
      <h2>statistics</h2>
      <Statistics allClicks={allClicks} good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App