import { create } from 'zustand'
import blogService from '../services/blogs'
import useNotificationStore from './notificationStore'
import useUserStore from './userStore'

const userForBlog = (loggedUser) => ({
  id: loggedUser.id,
  username: loggedUser.username,
  name: loggedUser.name,
})

const useBlogStore = create((set, get) => ({
  blogs: [],
  blogsLoaded: false,
  initializeBlogs: async () => {
    try {
      const blogs = await blogService.getAll()
      set({ blogs, blogsLoaded: true })
    } catch {
      set({ blogsLoaded: true })
      useNotificationStore
        .getState()
        .setNotification('loading blogs failed', 'error')
    }
  },
  createBlog: async (blogObject) => {
    const user = useUserStore.getState().user
    const returnedBlog = await blogService.create(blogObject)
    const blogToAdd = {
      ...returnedBlog,
      user: returnedBlog.user?.name ? returnedBlog.user : userForBlog(user),
    }

    set({ blogs: get().blogs.concat(blogToAdd) })
    useNotificationStore
      .getState()
      .setNotification(
        `a new blog ${blogToAdd.title} by ${blogToAdd.author} added`
      )
    return blogToAdd
  },
  likeBlog: async (blog) => {
    const user = useUserStore.getState().user

    if (!user) {
      useNotificationStore
        .getState()
        .setNotification('log in to like blogs', 'error')
      return null
    }

    const userId = blog.user?.id || blog.user?._id || blog.user
    const updatedBlog = {
      ...blog,
      user: userId,
      likes: (blog.likes || 0) + 1,
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    const blogToStore = {
      ...returnedBlog,
      user: returnedBlog.user?.name ? returnedBlog.user : blog.user,
    }

    set({
      blogs: get().blogs.map((b) => (b.id === blog.id ? blogToStore : b)),
    })
    return blogToStore
  },
  removeBlog: async (blog) => {
    await blogService.remove(blog.id)
    set({ blogs: get().blogs.filter((b) => b.id !== blog.id) })
    useNotificationStore.getState().setNotification(`removed ${blog.title}`)
  },
  addComment: async (blog, comment) => {
    const returnedBlog = await blogService.addComment(blog.id, comment)
    set({
      blogs: get().blogs.map((b) => (b.id === blog.id ? returnedBlog : b)),
    })
    useNotificationStore.getState().setNotification('comment added')
    return returnedBlog
  },
}))

export default useBlogStore
