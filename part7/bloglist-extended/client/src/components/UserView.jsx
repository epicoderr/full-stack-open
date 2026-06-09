import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, CardContent, List, ListItem, Typography } from '@mui/material'
import userService from '../services/users'

const UserView = () => {
  const { id } = useParams()
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users))
  }, [])

  const user = users.find((user) => user.id === id)

  if (!user) {
    return (
      <Card className="card">
        <CardContent>
          <Typography>User not found</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card user-view">
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="h5" component="h3" gutterBottom>
          added blogs
        </Typography>
        <List>
          {user.blogs.map((blog) => (
            <ListItem key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default UserView
