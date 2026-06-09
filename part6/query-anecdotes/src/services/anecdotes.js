const baseUrl = 'http://localhost:3001/anecdotes'

const checkStatus = async response => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'request failed')
  }
  return response.json()
}

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  return checkStatus(response)
}

export const createAnecdote = async content => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })
  return checkStatus(response)
}

export const updateAnecdote = async anecdote => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })
  return checkStatus(response)
}
