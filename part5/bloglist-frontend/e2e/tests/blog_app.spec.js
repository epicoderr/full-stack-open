const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })
    await request.post('/api/users', {
      data: {
        name: 'Other User',
        username: 'other',
        password: 'salainen',
      },
    })
    await page.goto('/')
  })

  test('login form is available from the navigation', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in').first()).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright blog', 'Test Author', 'https://example.com')
      await expect(page.getByText('Playwright blog')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable blog', 'Test Author', 'https://example.com')
      await page.getByText('Likeable blog').click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
      await expect(page.getByText('added by Matti Luukkainen')).toBeVisible()
    })

    test('a blog can be deleted by its creator', async ({ page }) => {
      await createBlog(page, 'Removable blog', 'Test Author', 'https://example.com')
      await page.getByText('Removable blog').click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Removable blog')).not.toBeVisible()
    })

    test('remove button is not shown to a user who did not create the blog', async ({ page }) => {
      await createBlog(page, 'Only creator can remove', 'Test Author', 'https://example.com')
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'other', 'salainen')
      await page.getByText('Only creator can remove').click()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered according to likes, most liked first', async ({ page }) => {
      await createBlog(page, 'First blog', 'Author One', 'https://first.com')
      await createBlog(page, 'Second blog', 'Author Two', 'https://second.com')
      await createBlog(page, 'Third blog', 'Author Three', 'https://third.com')

      await page.getByRole('link', { name: 'Second blog' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('link', { name: 'blogs' }).click()

      await page.getByRole('link', { name: 'Third blog' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('link', { name: 'blogs' }).click()

      const blogs = await page.locator('.blog').all()

      await expect(blogs[0]).toContainText('Third blog')
      await expect(blogs[1]).toContainText('Second blog')
      await expect(blogs[2]).toContainText('First blog')
    })
  })
})