import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 8,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const creatorId = blog.user?.id || blog.user?._id || blog.user
  const loggedId = user?.id || user?._id
  const canRemove =
    user && creatorId && creatorId.toString() === loggedId?.toString()

  return (
    <div className="blog" style={blogStyle}>
      <div className="blog-basic">
        <span className="blog-title-author">
          {blog.title} {blog.author}
        </span>
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <div className="blog-url">{blog.url}</div>
          <div className="blog-likes">
            likes {blog.likes || 0}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name || blog.user?.username}</div>
          {canRemove && (
            <button onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
