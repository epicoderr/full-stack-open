import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useField } from '../hooks'
import useNotificationStore from '../stores/notificationStore'
import useUserStore from '../stores/userStore'

const LoginForm = () => {
  const login = useUserStore((state) => state.login)
  const setNotification = useNotificationStore((state) => state.setNotification)
  const username = useField('text')
  const password = useField('password')
  const navigate = useNavigate()

  const { reset: resetUsername, ...usernameInput } = username
  const { reset: resetPassword, ...passwordInput } = password

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await login({ username: username.value, password: password.value })
      resetUsername()
      resetPassword()
      navigate('/')
    } catch {
      setNotification('wrong username or password', 'error')
      resetPassword()
    }
  }

  return (
    <Card className="form-card" sx={{ maxWidth: 460 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Log in to application
        </Typography>
        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <TextField label="username" name="username" {...usernameInput} />
          <TextField label="password" name="password" {...passwordInput} />
          <Button type="submit" variant="contained">
            login
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default LoginForm
