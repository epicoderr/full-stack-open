import { useState } from 'react'
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    onLogin({ username, password })
    setPassword('')
  }

  return (
    <Card className="form-card" sx={{ maxWidth: 460 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Log in to application
        </Typography>
        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <TextField
            label="username"
            name="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            label="password"
            name="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button type="submit" variant="contained">
            login
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default LoginForm
