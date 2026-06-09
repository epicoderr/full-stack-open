# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog_app.spec.js >> Blog app >> When logged in >> a new blog can be created
- Location: tests\blog_app.spec.js:54:5

# Error details

```
Test timeout of 5000ms exceeded.
```

```
Error: locator.click: Test timeout of 5000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'create new' })

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
  1  | const loginWith = async (page, username, password) => {
  2  |   await page.getByRole('link', { name: 'login' }).click()
  3  |   await page.getByLabel('username').fill(username)
  4  |   await page.getByLabel('password').fill(password)
  5  |   await page.getByRole('button', { name: 'login' }).click()
  6  | }
  7  | 
  8  | const createBlog = async (page, title, author, url) => {
> 9  |   await page.getByRole('link', { name: 'create new' }).click()
     |                                                        ^ Error: locator.click: Test timeout of 5000ms exceeded.
  10 |   await page.getByPlaceholder('title').fill(title)
  11 |   await page.getByPlaceholder('author').fill(author)
  12 |   await page.getByPlaceholder('url').fill(url)
  13 |   await page.getByRole('button', { name: 'create' }).click()
  14 |   await page.getByText(title).waitFor()
  15 | }
  16 | 
  17 | module.exports = { loginWith, createBlog }
  18 | 
```