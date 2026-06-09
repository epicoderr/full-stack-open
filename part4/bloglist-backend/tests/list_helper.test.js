const assert = require('node:assert')
const { test, describe } = require('node:test')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

const listWithOneBlog = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/dijkstra',
    likes: 5,
  },
]

describe('dummy', () => {
  test('dummy returns one', () => {
    assert.strictEqual(listHelper.dummy([]), 1)
  })
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog equals the likes of that blog', () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(helper.initialBlogs), 36)
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has only one blog is that blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })

  test('of a bigger list is the blog with most likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(helper.initialBlogs), {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com/canonical-string-reduction',
      likes: 12,
    })
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('returns the author with the largest amount of blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(helper.initialBlogs), {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})

describe('most likes', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('returns the author with the largest amount of likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(helper.initialBlogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
