import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAnecdote, getAnecdotes, updateAnecdote } from '../services/anecdotes'
import { useNotify } from './useNotification'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  const createMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: anecdote => {
      queryClient.setQueryData(['anecdotes'], old =>
        (old || []).concat(anecdote)
      )
      notify(`anecdote '${anecdote.content}' created`)
    },
    onError: error => {
      notify(error.message, 'error')
    },
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: anecdote => {
      queryClient.setQueryData(['anecdotes'], old =>
        (old || []).map(a =>
          a.id === anecdote.id ? anecdote : a
        )
      )
      notify(`you voted '${anecdote.content}'`)
    },
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: content => createMutation.mutate(content),
    voteAnecdote: anecdote =>
      voteMutation.mutate({
        ...anecdote,
        votes: anecdote.votes + 1,
      }),
  }
}