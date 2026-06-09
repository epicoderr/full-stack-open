import { useAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const { notify } = useNotificationActions()

  const handleVote = async anecdote => {
    const updatedAnecdote = await vote(anecdote.id)

    if (updatedAnecdote) {
      notify(`you voted '${updatedAnecdote.content}'`)
    }
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => remove(anecdote.id)}>remove</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
