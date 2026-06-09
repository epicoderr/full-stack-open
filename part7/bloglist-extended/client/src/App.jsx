import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container } from '@mui/material'
import BlogList from './components/BlogList'
import BlogDetails from './components/BlogDetails'
import BlogForm from './components/BlogForm'
import ErrorBoundary from './components/ErrorBoundary'
import LoginForm from './components/LoginForm'
import NavBar from './components/NavBar'
import Notification from './components/Notification'
import NotFound from './components/NotFound'
import Users from './components/Users'
import UserView from './components/UserView'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'

const App = () => {
  const user = useUserStore((state) => state.user)
  const initializeUser = useUserStore((state) => state.initializeUser)
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs)
  const blogsLoaded = useBlogStore((state) => state.blogsLoaded)

  useEffect(() => {
    initializeUser()
    initializeBlogs()
  }, [initializeUser, initializeBlogs])

  return (
    <Container className="app-shell">
      <NavBar />
      <Notification />
      <ErrorBoundary>
        <main>
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route
              path="/login"
              element={user ? <Navigate replace to="/" /> : <LoginForm />}
            />
            <Route
              path="/create"
              element={user ? <BlogForm /> : <Navigate replace to="/login" />}
            />
            <Route
              path="/blogs/:id"
              element={blogsLoaded ? <BlogDetails /> : <p>loading blog...</p>}
            />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </Container>
  )
}

export default App
