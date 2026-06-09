# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog_app.spec.js >> Blog app >> Login >> succeeds with correct credentials
- Location: tests\blog_app.spec.js:31:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Matti Luukkainen logged in')
Expected: visible
Error: strict mode violation: getByText('Matti Luukkainen logged in') resolved to 2 elements:
    1) <span class="MuiTypography-root MuiTypography-body1 css-rizt0-MuiTypography-root">Matti Luukkainen logged in</span> aka locator('span')
    2) <div class="MuiAlert-message css-zioonp-MuiAlert-message">Matti Luukkainen logged in</div> aka getByRole('alert').getByText('Matti Luukkainen logged in')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Matti Luukkainen logged in')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - link "blogs" [ref=e6] [cursor=pointer]:
        - /url: /
      - link "new blog" [ref=e7] [cursor=pointer]:
        - /url: /create
      - generic [ref=e8]:
        - generic [ref=e9]: Matti Luukkainen logged in
        - button "logout" [ref=e10] [cursor=pointer]
  - alert [ref=e11]:
    - img [ref=e13]
    - generic [ref=e15]: Matti Luukkainen logged in
  - main [ref=e16]:
    - generic [ref=e17]:
      - heading "blogs" [level=2] [ref=e18]
      - table [ref=e20]:
        - rowgroup [ref=e21]:
          - row "title author likes" [ref=e22]:
            - columnheader "title" [ref=e23]
            - columnheader "author" [ref=e24]
            - columnheader "likes" [ref=e25]
        - rowgroup
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
> 33 |       await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  34 |     })
  35 | 
  36 |     test('stays logged in after page reload', async ({ page }) => {
  37 |       await loginWith(page, 'mluukkai', 'salainen')
  38 |       await page.reload()
  39 |       await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  40 |     })
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