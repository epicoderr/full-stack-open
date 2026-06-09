import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()
  const { notify } = useNotificationActions()

  const addAnecdote = async event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    const anecdote = await create(content)

    if (anecdote) {
      notify(`you created '${anecdote.content}'`)
    }

    event.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
