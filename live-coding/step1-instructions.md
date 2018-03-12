# Step1 - Adding Functional Tests

* Install testing framework

```sh
$ npm install --save-dev mocha chai
...
```

* Install Selenium Webdriver

```sh
$ npm install --save-dev selenium-webdriver chromedriver
...
```

* Create a mocha scaffold in `functional.test.js`

```js
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')

describe('', function () {
  it('', async () => {
  })
})
```

* Add imports for selenium

```js
const webdriver = require('selenium-webdriver')
require('chromedriver')
const {By, until} = webdriver
```

* Add initializers for selenium

```js
describe('registration page', function() {
  let driver
  before(async () => driver = await new webdriver.Builder().forBrowser('chrome').build())
  after(async () => await driver.quit())

  it('should not allow a blank email', async () => {
```

* Open the browser in the correct page

```js
  it('should not allow a blank email', async () => {
    await driver.get('http://localhost:3000/register')

```

* Enter username and password

```js
    await driver.wait(until.elementLocated(By.css('input[placeholder=Username]')))

    const userNameField = await driver.findElement(By.css('input[placeholder=Username]'))
    await userNameField.sendKeys('aUsername')

    const passwordField = await driver.findElement(By.css('input[placeholder=Password]'))
    await passwordField.sendKeys('aPassword')
```

* Click on the submit button

```js
    const submit = await driver.findElement(By.css('button[type=submit]'))

    await submit.click()
```

* Ensure error message appears

```js

    await driver.wait(until.elementLocated(By.css('[class=error-messages]')))

    const errorMessages = await driver.findElement(By.css('[class=error-messages]'))
    expect(await errorMessages.getText()).to.include("email can't be blank")
```

* Run it

```sh
$ npm test
...
```