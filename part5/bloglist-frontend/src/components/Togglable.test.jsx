import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

test('renders children only after the visible button is clicked and hides them with cancel', async () => {
  const user = userEvent.setup()

  render(
    <Togglable buttonLabel="show form">
      <div>secret content</div>
    </Togglable>
  )

  expect(screen.queryByText('secret content')).not.toBeVisible()

  await user.click(screen.getByText('show form'))
  expect(screen.getByText('secret content')).toBeVisible()

  await user.click(screen.getByText('cancel'))
  expect(screen.queryByText('secret content')).not.toBeVisible()
})
