import { useState } from 'react'
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Card className="form-card" sx={{ maxWidth: 520 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Create new blog
        </Typography>
        <Stack component="form" onSubmit={addBlog} spacing={2}>
          <TextField
            label="title"
            placeholder="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            label="author"
            placeholder="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            label="url"
            placeholder="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button type="submit" variant="contained">
            create
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default BlogForm
