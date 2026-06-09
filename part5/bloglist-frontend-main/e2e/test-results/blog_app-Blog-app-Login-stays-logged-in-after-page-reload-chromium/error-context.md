# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog_app.spec.js >> Blog app >> Login >> stays logged in after page reload
- Location: tests\blog_app.spec.js:36:5

# Error details

```
Test timeout of 5000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Matti Luukkainen logged in')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Matti Luukkainen logged in')

```

```yaml
- banner:
  - link "blogs":
    - /url: /
  - link "login":
    - /url: /login
- main:
  - heading "Log in to application" [level=2]
  - text: username
  - textbox "username"
  - text: password
  - textbox "password"
  - button "login"
```

# Test source

```ts
  1  | const { test, expect, beforeEach, describe } = require('@playwright/test')
  2  | const { loginWith, createBlog } = require('./helper')
  3  | 
  4  | describe('Blog app', () => {
  5  |   beforeEach(async ({ page, request }) => {
  6  |     await request.post('/api/testing/reset')
  7  |     await request.post('/api/users', {
  8  |       data: {
  9  |         name: 'Matti Luukkainen',
  10 |         username: 'mluukkai',
  11 |         password: 'salainen',
  12 |       },
  13 |     })
  14 |     await request.post('/api/users', {
  15 |       data: {
  16 |         name: 'Other User',
  17 |         username: 'other',
  18 |         password: 'salainen',
  19 |       },
  20 |     })
  21 |     await page.goto('/')
  22 |   })
  23 | 
  24 |   test('login form is available from the navigation', async ({ page }) => {
  25 |     await page.getByRole('link', { name: 'login' }).click()
  26 |     await expect(page.getByLabel('username')).toBeVisible()
  27 |     await expect(page.getByLabel('password')).toBeVisible()
  28 |   })
  29 | 
  30 |   describe('Login', () => {
  31 |     test('succeeds with correct credentials', async ({ page }) => {
  32 |       await loginWith(page, 'mluukkai', 'salainen')
  33 |       await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  34 |     })
  41 | 
  42 |     test('fails with wrong credentials', async ({ page }) => {
  43 |       await loginWith(page, 'mluukkai', 'wrong')
  44 |       await expect(page.getByText('wrong username or password')).toBeVisible()
  45 |       await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  46 |     })
  47 |   })
  48 | 
  49 |   describe('When logged in', () => {
  50 |     beforeEach(async ({ page }) => {
  51 |       await loginWith(page, 'mluukkai', 'salainen')
  52 |     })
  53 | 
  54 |     test('a new blog can be created', async ({ page }) => {
  55 |       await createBlog(page, 'Playwright blog', 'Test Author', 'https://example.com')
  56 |       await expect(page.getByText('Playwright blog')).toBeVisible()
  57 |     })
  58 | 
  59 |     test('a blog can be liked', async ({ page }) => {
  60 |       await createBlog(page, 'Likeable blog', 'Test Author', 'https://example.com')
  61 |       await page.getByText('Likeable blog').click()
  62 |       await page.getByRole('button', { name: 'like' }).click()
  63 |       await expect(page.getByText('likes 1')).toBeVisible()
  64 |       await expect(page.getByText('added by Matti Luukkainen')).toBeVisible()
  65 |     })
  66 | 
  67 |     test('a blog can be deleted by its creator', async ({ page }) => {
  68 |       await createBlog(page, 'Removable blog', 'Test Author', 'https://example.com')
  69 |       await page.getByText('Removable blog').click()
  70 |       page.on('dialog', dialog => dialog.accept())
  71 |       await page.getByRole('button', { name: 'remove' }).click()
  72 |       await expect(page.getByText('Removable blog')).not.toBeVisible()
  73 |     })
  74 | 
  75 |     test('remove button is not shown to a user who did not create the blog', async ({ page }) => {
  76 |       await createBlog(page, 'Only creator can remove', 'Test Author', 'https://example.com')
  77 |       await page.getByRole('button', { name: 'logout' }).click()
  78 |       await loginWith(page, 'other', 'salainen')
  79 |       await page.getByText('Only creator can remove').click()
  80 |       await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
  81 |       await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
  82 |     })
  83 |   })
  84 | })
  85 | 
```