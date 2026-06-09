import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useAnecdoteStore, { useAnecdotes } from './store'
import * as anecdoteService from './services/anecdotes'

vi.mock('./services/anecdotes', () => ({
  getAll: vi.fn(),
  createNew: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))

const anecdotes = [
  {
    id: '1',
    content: 'first anecdote',
    votes: 1,
  },
  {
    id: '2',
    content: 'most popular anecdote',
    votes: 5,
  },
  {
    id: '3',
    content: 'another story',
    votes: 2,
  },
]

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [],
    filter: '',
  })
  vi.clearAllMocks()
})

describe('anecdote store', () => {
  it('initializes anecdotes from backend', async () => {
    anecdoteService.getAll.mockResolvedValue(anecdotes)

    await useAnecdoteStore.getState().actions.initialize()

    expect(useAnecdoteStore.getState().anecdotes).toEqual(anecdotes)
  })

  it('voting increases the number of votes for an anecdote', async () => {
    useAnecdoteStore.setState({
      anecdotes,
      filter: '',
    })

    anecdoteService.update.mockResolvedValue({
      id: '1',
      content: 'first anecdote',
      votes: 2,
    })

    await useAnecdoteStore.getState().actions.vote('1')

    const votedAnecdote = useAnecdoteStore
      .getState()
      .anecdotes.find(anecdote => anecdote.id === '1')

    expect(votedAnecdote.votes).toBe(2)
  })
})

describe('useAnecdotes', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes,
      filter: '',
    })
  })

  it('returns anecdotes sorted by votes', () => {
    const { result } = renderHook(() => useAnecdotes())

    expect(result.current.map(anecdote => anecdote.id)).toEqual([
      '2',
      '3',
      '1',
    ])
  })

  it('returns filtered anecdotes', () => {
    useAnecdoteStore.setState({
      anecdotes,
      filter: 'another',
    })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual([
      {
        id: '3',
        content: 'another story',
        votes: 2,
      },
    ])
  })
})