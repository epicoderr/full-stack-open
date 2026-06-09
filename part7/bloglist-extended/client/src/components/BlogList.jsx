import { Link } from 'react-router-dom'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import useBlogStore from '../stores/blogStore'

const BlogList = ({ blogs: blogsProp }) => {
  const storeBlogs = useBlogStore((state) => state.blogs)
  const blogs = blogsProp || storeBlogs
  const sortedBlogs = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        blogs
      </Typography>
      <TableContainer component={Paper} className="blog-list">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
              <TableCell>author</TableCell>
              <TableCell align="right">likes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBlogs.map((blog) => (
              <TableRow className="blog" key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
                <TableCell align="right">{blog.likes || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
