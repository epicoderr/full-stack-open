import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  Link,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useField } from '../hooks'
import useBlogStore from '../stores/blogStore'
import useNotificationStore from '../stores/notificationStore'
import useUserStore from '../stores/userStore'

const BlogDetails = ({
  blog: blogProp,
  user: userProp,
  likeBlog: likeBlogProp,
  removeBlog: removeBlogProp,
}) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const blogs = useBlogStore((state) => state.blogs)
  const storeLikeBlog = useBlogStore((state) => state.likeBlog)
  const storeRemoveBlog = useBlogStore((state) => state.removeBlog)
  const addComment = useBlogStore((state) => state.addComment)
  const storeUser = useUserStore((state) => state.user)
  const setNotification = useNotificationStore((state) => state.setNotification)
  const comment = useField('text')
  const { reset: resetComment, ...commentInput } = comment

  const blog = blogProp || blogs.find((blog) => blog.id === id)
  const user = userProp !== undefined ? userProp : storeUser
  const likeBlog = likeBlogProp || storeLikeBlog
  const removeBlog = removeBlogProp || storeRemoveBlog

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
  const canRemove =
    user && creatorId && creatorId.toString() === loggedId?.toString()

  const handleLike = async () => {
    try {
      await likeBlog(blog)
    } catch {
      setNotification('liking blog failed', 'error')
    }
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await removeBlog(blog)
        navigate('/')
      } catch {
        setNotification('removing blog failed', 'error')
      }
    }
  }

  const handleComment = async (event) => {
    event.preventDefault()

    try {
      await addComment(blog, comment.value)
      resetComment()
    } catch {
      setNotification('adding comment failed', 'error')
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
              <Button
                variant="contained"
                size="small"
                sx={{ ml: 1 }}
                onClick={handleLike}
              >
                like
              </Button>
            )}
          </Typography>
          <Typography>
            added by {blog.user?.name || blog.user?.username || 'unknown'}
          </Typography>
          {canRemove && (
            <Button variant="outlined" color="error" onClick={handleRemove}>
              remove
            </Button>
          )}
          <div className="comments-section">
            <Typography variant="h5" component="h3" gutterBottom>
              comments
            </Typography>
            <Stack
              component="form"
              direction="row"
              spacing={1}
              onSubmit={handleComment}
            >
              <TextField label="comment" size="small" {...commentInput} />
              <Button type="submit" variant="contained">
                add comment
              </Button>
            </Stack>
            <List>
              {(blog.comments || []).map((comment, index) => (
                <ListItem key={`${comment}-${index}`}>{comment}</ListItem>
              ))}
            </List>
          </div>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default BlogDetails
