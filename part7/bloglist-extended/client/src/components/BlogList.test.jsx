import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogList from './BlogList'

test('renders blogs sorted by likes in descending order', () => {
  const blogs = [
    { id: '1', title: 'Least liked', author: 'A', likes: 1 },
    { id: '2', title: 'Most liked', author: 'B', likes: 10 },
    { id: '3', title: 'Middle liked', author: 'C', likes: 5 },
  ]

  render(
    <MemoryRouter>
      <BlogList blogs={blogs} />
    </MemoryRouter>
  )

  const links = screen.getAllByRole('link')
  expect(links.map((link) => link.textContent)).toEqual([
    'Most liked',
    'Middle liked',
    'Least liked',
  ])
})
