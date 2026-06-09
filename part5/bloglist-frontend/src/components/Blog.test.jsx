import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  id: '1',
  title: 'Component testing with React',
  author: 'Tester',
  url: 'https://example.com/component-testing',
  likes: 3,
  user: { id: 'u1', name: 'Test User' },
}

test('renders title and author but not url or likes by default', () => {
  render(<Blog blog={blog} handleLike={() => {}} handleRemove={() => {}} />)

  expect(screen.getByText('Component testing with React Tester')).toBeVisible()
  expect(screen.queryByText('https://example.com/component-testing')).toBeNull()
  expect(screen.queryByText(/likes 3/)).toBeNull()
})

test('shows url and likes after clicking view', async () => {
  const user = userEvent.setup()
  render(<Blog blog={blog} handleLike={() => {}} handleRemove={() => {}} />)

  await user.click(screen.getByText('view'))

  expect(screen.getByText('https://example.com/component-testing')).toBeVisible()
  expect(screen.getByText(/likes 3/)).toBeVisible()
})

test('clicking like twice calls handler twice', async () => {
  const user = userEvent.setup()
  const handleLike = vi.fn()
  render(<Blog blog={blog} handleLike={handleLike} handleRemove={() => {}} />)

  await user.click(screen.getByText('view'))
  await user.click(screen.getByText('like'))
  await user.click(screen.getByText('like'))

  expect(handleLike.mock.calls).toHaveLength(2)
})


test('shows remove button only to the blog creator', async () => {
  const user = userEvent.setup()
  const { rerender } = render(
    <Blog blog={blog} handleLike={() => {}} handleRemove={() => {}} user={{ id: 'u2' }} />
  )

  await user.click(screen.getByText('view'))
  expect(screen.queryByText('remove')).toBeNull()

  rerender(<Blog blog={blog} handleLike={() => {}} handleRemove={() => {}} user={{ id: 'u1' }} />)
  expect(screen.getByText('remove')).toBeVisible()
})
