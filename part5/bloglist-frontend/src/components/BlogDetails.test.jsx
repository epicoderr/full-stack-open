import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogDetails from './BlogDetails'

const blog = {
  id: '1',
  title: 'Routed blog',
  author: 'Router Author',
  url: 'https://example.com/routed',
  likes: 7,
  user: { id: 'u1', name: 'Creator' },
}

const renderDetails = user => render(
  <MemoryRouter>
    <BlogDetails blog={blog} user={user} likeBlog={() => {}} removeBlog={() => {}} />
  </MemoryRouter>
)

test('unauthenticated users see blog data but no buttons', () => {
  renderDetails(null)

  expect(screen.getByText('Routed blog')).toBeVisible()
  expect(screen.getByText(/likes 7/)).toBeVisible()
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('authenticated non-creator sees like button only', () => {
  renderDetails({ id: 'u2', name: 'Other User' })

  expect(screen.getByText('like')).toBeVisible()
  expect(screen.queryByText('remove')).toBeNull()
})

test('creator sees like and remove buttons', () => {
  renderDetails({ id: 'u1', name: 'Creator' })

  expect(screen.getByText('like')).toBeVisible()
  expect(screen.getByText('remove')).toBeVisible()
})
