import { Link } from 'react-router-dom'
import { Button, Card, CardContent, Typography } from '@mui/material'

const NotFound = () => (
  <Card className="card">
    <CardContent>
      <Typography variant="h4" component="h2" gutterBottom>
        Page not found
      </Typography>
      <Typography paragraph>
        The address you tried to open does not exist.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Go back to blogs
      </Button>
    </CardContent>
  </Card>
)

export default NotFound
