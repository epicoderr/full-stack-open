import { useNavigate } from 'react-router-dom'
import { Button, Card, CardContent, Link, Stack, Typography } from '@mui/material'

const BlogDetails = ({ blog, user, likeBlog, removeBlog }) => {
  const navigate = useNavigate()

  if (!blog) {
    return (
      <Card className="card">
        <CardContent>
          <Typography>Blog not found</Typography>
        </CardContent>
      </Card>
    )
  }

  const creatorId = blog.user?.id || blog.user?._id || blog.user
  const loggedId = user?.id || user?._id
  const canRemove = user && creatorId && creatorId.toString() === loggedId?.toString()

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await removeBlog(blog)
      navigate('/')
    }
  }

  return (
    <Card className="card blog-view">
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom>
          {blog.title}
        </Typography>
        <Stack spacing={2}>
          <Typography>
            <Link href={blog.url}>{blog.url}</Link>
          </Typography>
          <Typography>
            likes {blog.likes || 0}
            {user && (
              <Button variant="contained" size="small" sx={{ ml: 1 }} onClick={() => likeBlog(blog)}>
                like
              </Button>
            )}
          </Typography>
          <Typography>added by {blog.user?.name || blog.user?.username || 'unknown'}</Typography>
          {canRemove && (
            <Button variant="outlined" color="error" onClick={handleRemove}>
              remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default BlogDetails
