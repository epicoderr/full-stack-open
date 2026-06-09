import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useMatch, useNavigate } from 'react-router-dom'
import { Container } from '@mui/material'
import BlogList from './components/BlogList'
import BlogDetails from './components/BlogDetails'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import NavBar from './components/NavBar'
import Notification from './components/Notification'
import NotFound from './components/NotFound'
import blogService from './services/blogs'
import loginService from './services/login'

const storedUserKey = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogsLoaded, setBlogsLoaded] = useState(false)
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch {
        notify('loading blogs failed', 'error')
      } finally {
        setBlogsLoaded(true)
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(storedUserKey)

    if (loggedUserJSON) {
      try {
        const storedUser = JSON.parse(loggedUserJSON)
        setUser(storedUser)
        blogService.setToken(storedUser.token)
      } catch {
        window.localStorage.removeItem(storedUserKey)
      }
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const userForBlog = loggedUser => ({
    id: loggedUser.id,
    username: loggedUser.username,
    name: loggedUser.name,
  })

  const handleLogin = async credentials => {
    try {
      const loggedUser = await loginService.login(credentials)
      window.localStorage.setItem(storedUserKey, JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      notify(`welcome ${loggedUser.name}`)
      navigate('/')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(storedUserKey)
    blogService.clearToken()
    setUser(null)
    notify('logged out')
    navigate('/')
  }

  const createBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      const blogToAdd = {
        ...returnedBlog,
        user: returnedBlog.user?.name ? returnedBlog.user : userForBlog(user),
      }

      setBlogs(currentBlogs => currentBlogs.concat(blogToAdd))
      notify(`a new blog ${blogToAdd.title} by ${blogToAdd.author} added`)
      navigate('/')
    } catch {
      notify('creating blog failed', 'error')
    }
  }

  const likeBlog = async blog => {
    if (!user) {
      notify('log in to like blogs', 'error')
      return
    }

    const userId = blog.user?.id || blog.user?._id || blog.user
    const updatedBlog = {
      ...blog,
      user: userId,
      likes: (blog.likes || 0) + 1,
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      const blogToStore = {
        ...returnedBlog,
        user: returnedBlog.user?.name ? returnedBlog.user : blog.user,
      }

      setBlogs(currentBlogs =>
        currentBlogs.map(b => (b.id === blog.id ? blogToStore : b))
      )
    } catch {
      notify('liking blog failed', 'error')
    }
  }

  const removeBlog = async blog => {
    try {
      await blogService.remove(blog.id)
      setBlogs(currentBlogs => currentBlogs.filter(b => b.id !== blog.id))
      notify(`removed ${blog.title}`)
    } catch {
      notify('removing blog failed', 'error')
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(blog => blog.id === match.params.id) : null

  return (
    <Container className="app-shell">
      <NavBar user={user} onLogout={handleLogout} />
      <Notification notification={notification} />
      <main>
        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route
            path="/login"
            element={
              user ? <Navigate replace to="/" /> : <LoginForm onLogin={handleLogin} />
            }
          />
          <Route
            path="/create"
            element={
              user ? <BlogForm createBlog={createBlog} /> : <Navigate replace to="/login" />
            }
          />
          <Route
            path="/blogs/:id"
            element={
              blogsLoaded ? (
                <BlogDetails
                  blog={blog}
                  user={user}
                  likeBlog={likeBlog}
                  removeBlog={removeBlog}
                />
              ) : (
                <p>loading blog...</p>
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Container>
  )
}

export default App
