const storedUserKey = 'loggedBlogappUser'

const getUser = () => {
  const userJSON = window.localStorage.getItem(storedUserKey)

  if (!userJSON) {
    return null
  }

  try {
    return JSON.parse(userJSON)
  } catch {
    window.localStorage.removeItem(storedUserKey)
    return null
  }
}

const saveUser = (user) => {
  window.localStorage.setItem(storedUserKey, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(storedUserKey)
}

export default { getUser, saveUser, removeUser }
