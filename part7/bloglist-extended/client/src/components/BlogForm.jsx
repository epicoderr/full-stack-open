import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useField } from '../hooks'
import useBlogStore from '../stores/blogStore'
import useNotificationStore from '../stores/notificationStore'

const BlogForm = ({ createBlog: createBlogProp }) => {
  const storeCreateBlog = useBlogStore((state) => state.createBlog)
  const createBlog = createBlogProp || storeCreateBlog
  const setNotification = useNotificationStore((state) => state.setNotification)
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const { reset: resetTitle, ...titleInput } = title
  const { reset: resetAuthor, ...authorInput } = author
  const { reset: resetUrl, ...urlInput } = url

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      await createBlog({
        title: title.value,
        author: author.value,
        url: url.value,
      })
      resetTitle()
      resetAuthor()
      resetUrl()
    } catch {
      setNotification('creating blog failed', 'error')
    }
  }

  return (
    <Card className="form-card" sx={{ maxWidth: 520 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Create new blog
        </Typography>
        <Stack component="form" onSubmit={addBlog} spacing={2}>
          <TextField label="title" placeholder="title" {...titleInput} />
          <TextField label="author" placeholder="author" {...authorInput} />
          <TextField label="url" placeholder="url" {...urlInput} />
          <Button type="submit" variant="contained">
            create
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default BlogForm
