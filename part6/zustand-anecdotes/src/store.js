import { useMemo } from 'react'
import { create } from 'zustand'
import * as anecdoteService from './services/anecdotes'

let notificationTimer

const sortByVotes = anecdotes =>
  anecdotes.toSorted((a, b) => b.votes - a.votes)

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  notification: null,
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set({ anecdotes })
    },
    create: async content => {
      if (!content.trim()) {
        return
      }
      const anecdote = await anecdoteService.createNew(content.trim())
      set(state => ({ anecdotes: state.anecdotes.concat(anecdote) }))
      return anecdote
    },
    vote: async id => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      if (!anecdote) {
        return
      }
      const updatedAnecdote = await anecdoteService.update({
        ...anecdote,
        votes: anecdote.votes + 1,
      })
      set(state => ({
        anecdotes: state.anecdotes.map(a =>
          a.id === id ? updatedAnecdote : a
        ),
      }))
      return updatedAnecdote
    },
    remove: async id => {
      await anecdoteService.remove(id)
      set(state => ({
        anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id),
      }))
    },
    setFilter: filter => set({ filter }),
  },
}))

export const selectVisibleAnecdotes = ({ anecdotes, filter }) =>
  sortByVotes(
    anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  )

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return useMemo(
    () => selectVisibleAnecdotes({ anecdotes, filter }),
    [anecdotes, filter]
  )
}
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export default useAnecdoteStore
