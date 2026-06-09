import { describe, test, expect, beforeEach } from 'vitest'
import useFeedbackStore from './store'

beforeEach(() => {
  useFeedbackStore.setState({ good: 0, neutral: 0, bad: 0 })
})

describe('unicafe store', () => {
  test('starts with zero feedback', () => {
    const state = useFeedbackStore.getState()
    expect(state.good).toBe(0)
    expect(state.neutral).toBe(0)
    expect(state.bad).toBe(0)
  })

  test('feedback actions update state', () => {
    const { actions } = useFeedbackStore.getState()

    actions.good()
    actions.good()
    actions.neutral()
    actions.bad()

    const state = useFeedbackStore.getState()
    expect(state.good).toBe(2)
    expect(state.neutral).toBe(1)
    expect(state.bad).toBe(1)
  })
})
