import { Link } from 'react-router-dom'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import useUserStore from '../stores/userStore'

const buttonHover = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

const NavBar = () => {
  const user = useUserStore((state) => state.user)
  const logout = useUserStore((state) => state.logout)

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Button color="inherit" component={Link} to="/" sx={buttonHover}>
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users" sx={buttonHover}>
          users
        </Button>
        {user && (
          <Button
            color="inherit"
            component={Link}
            to="/create"
            sx={buttonHover}
          >
            new blog
          </Button>
        )}
        {!user && (
          <Button color="inherit" component={Link} to="/login" sx={buttonHover}>
            login
          </Button>
        )}
        {user && (
          <Box
            sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <Typography component="span">{user.name} logged in</Typography>
            <Button color="inherit" variant="outlined" onClick={logout}>
              logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
