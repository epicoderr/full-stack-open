import { create } from 'zustand'

const initialState = {
  good: 0,
  neutral: 0,
  bad: 0,
}

const useFeedbackStore = create(set => ({
  ...initialState,
  actions: {
    good: () => set(state => ({ good: state.good + 1 })),
    neutral: () => set(state => ({ neutral: state.neutral + 1 })),
    bad: () => set(state => ({ bad: state.bad + 1 })),
    reset: () => set(initialState),
  },
}))

export const useGood = () => useFeedbackStore(state => state.good)
export const useNeutral = () => useFeedbackStore(state => state.neutral)
export const useBad = () => useFeedbackStore(state => state.bad)
export const useFeedback = () => {
  const good = useFeedbackStore(state => state.good)
  const neutral = useFeedbackStore(state => state.neutral)
  const bad = useFeedbackStore(state => state.bad)
  return { good, neutral, bad }
}
export const useFeedbackActions = () => useFeedbackStore(state => state.actions)

export default useFeedbackStore
