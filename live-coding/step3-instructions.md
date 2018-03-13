# Step3 - Adding screenshot validations

* Adding validation library

```sh
$ npm install --save-dev chai-image-assert
...
```

* Add require

```js
require('chai').use(require('chai-image-assert')(__dirname))
```

* Replace `before` with something that also determines size of window

```js
  const chromeCapabilities = webdriver.Capabilities.chrome()
  chromeCapabilities.set('chromeOptions', {
    args: ['--window-size=1024,900' /*, '--headless', '--disable-gpu', '--hide-scrollbars'*/],
  })

  let driver
  before(
    async () =>
      (driver = await new webdriver.Builder()
        .withCapabilities(chromeCapabilities)
        .forBrowser('chrome')
        .build()),
  )
```

* Replace existing validation in blank email test with visual validation

```js
    expect(Buffer.from(await driver.takeScreenshot(), 'base64')).to.matchImage(
      'registration-blank-email-error',
    )
```

* Same for invalid email test

```js
    expect(Buffer.from(await driver.takeScreenshot(), 'base64')).to.matchImage(
      'registration-invalid-email-error',
    )
```

* Add a helper function

```js
  async function checkWindow(baseImageName) {
    const image = await driver.takeScreenshot()

    expect(Buffer.from(image, 'base64')).to.matchImage(baseImageName)
  }
```

* Replace `validateUserHomePage` implementation with a simple checkWindow

```js
    await waitFor('img[alt=ausername]')

    await checkWindow('empty-user-home-page')
```

* Same for `validatePost`

```js
    await waitFor('h1')

    await checkWindow('new-post')
```

* Same for `validateComment`

```js
    await waitFor('div.card .card-block')

    await checkWindow('new-comment')
```

* Same for `validateBlog`

```js
    await driver.get('http://localhost:3000/')

    await checkWindow('anonymous-home-page')

    await click('.article-preview h1')
    await waitFor('.article-page')

    await checkWindow('anonymous-blog-post-view')
```
