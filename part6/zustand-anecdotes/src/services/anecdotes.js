const baseUrl = 'http://localhost:3001/anecdotes'

const checkStatus = async response => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'request failed')
  }
  return response.json()
}

export const getAll = async () => {
  const response = await fetch(baseUrl)
  return checkStatus(response)
}

export const createNew = async content => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })
  return checkStatus(response)
}

export const update = async anecdote => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })
  return checkStatus(response)
}

export const remove = async id => {
  const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error('remove failed')
  }
}
