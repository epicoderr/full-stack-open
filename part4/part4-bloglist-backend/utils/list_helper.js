const dummy = () => 1
const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0)
const favoriteBlog = blogs => blogs.length === 0 ? null : blogs.reduce((fav, blog) => blog.likes > fav.likes ? blog : fav)

const mostBlogs = blogs => {
  if (blogs.length === 0) return null
  const counts = blogs.reduce((acc, blog) => ({ ...acc, [blog.author]: (acc[blog.author] || 0) + 1 }), {})
  const author = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
  return { author, blogs: counts[author] }
}

const mostLikes = blogs => {
  if (blogs.length === 0) return null
  const counts = blogs.reduce((acc, blog) => ({ ...acc, [blog.author]: (acc[blog.author] || 0) + blog.likes }), {})
  const author = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
  return { author, likes: counts[author] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
