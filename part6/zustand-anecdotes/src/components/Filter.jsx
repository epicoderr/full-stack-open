import { useFilter, useAnecdoteActions } from '../store'

const Filter = () => {
  const filter = useFilter()
  const { setFilter } = useAnecdoteActions()

  return (
    <div>
      filter <input value={filter} onChange={event => setFilter(event.target.value)} />
    </div>
  )
}

export default Filter
