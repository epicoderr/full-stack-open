import { useAnecdotes } from './hooks/useAnecdotes'
import Notification from './components/Notification'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  const {
    anecdotes,
    isPending,
    isError,
    addAnecdote,
    voteAnecdote,
  } = useAnecdotes()

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteList
        anecdotes={anecdotes}
        voteAnecdote={voteAnecdote}
      />
      <AnecdoteForm addAnecdote={addAnecdote} />
    </div>
  )
}

export default App