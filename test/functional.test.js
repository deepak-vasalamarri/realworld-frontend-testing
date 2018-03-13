'use strict'
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const webdriver = require('selenium-webdriver')
const {Eyes} = require('eyes.selenium')
require('chromedriver')
const {By, until, Key} = webdriver

require('chai').use(require('chai-image-assert')(__dirname))

describe('registration page', function() {
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
  after(async () => await driver.quit())

  let eyes
  before(async () => {
    eyes = new Eyes()
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)

    await eyes.open(driver, 'Test', 'Realworld', {width: 800, height: 600})
  })
  after(async () => await eyes.close())

  async function waitFor(selector) {
    await driver.wait(until.elementLocated(By.css(selector)))
  }

  async function setText(selector, text) {
    const field = await driver.findElement(By.css(selector))

    await field.sendKeys(text)
  }

  async function click(selector) {
    const element = await driver.findElement(By.css(selector))
    await element.click()
  }

  async function getText(selector) { // eslint-disable-line
    const element = await driver.findElement(By.css(selector))

    return await element.getText()
  }

  async function checkWindow(baseImageName) {
    await eyes.checkWindow(baseImageName)
  }

  it('should not allow a blank email', async () => {
    // action: browse to registration page
    await driver.get('http://localhost:3000/register')

    await waitFor('input[placeholder=Username]')

    // action: set username and password to something, but leave email blank
    await setText('input[placeholder=Username]', 'aUsername')
    await setText('input[placeholder=Password]', 'aPassword')

    // action: submit form
    await click('button[type=submit]')

    // validate: there is an error message
    await waitFor('.error-messages')

    await checkWindow('registration-blank-email-error')
  })

  it('should do the main flow correctly', async () => {
    await registerUser()
    await validateUserHomePage()
    await publishPost()
    await validatePost()
    await addComment()
    await validateComment()
    await logout()
    await validateBlog()
  })

  async function registerUser() {
    // action: browse to registration page
    await driver.get('http://localhost:3000/register')

    // action: set username, password, email to something
    await setText('input[placeholder=Username]', 'ausername')

    await setText('input[placeholder=Password]', 'aPassword')

    await setText('input[placeholder=Email]', 'an@email.com')

    // action: submit form
    await click('button[type=submit]')
  }

  async function validateUserHomePage() {
    await waitFor('.article-preview')

    await checkWindow('empty-user-home-page')
  }

  async function publishPost() {
    // action: click on new post
    const newPost = await driver.findElement(By.partialLinkText('New Post'))
    await newPost.click()

    await waitFor('input[placeholder="Article Title"]')

    // action: set the title, description, and article
    await setText('input[placeholder="Article Title"]', 'a title')
    await setText('input[placeholder="What\'s this article about?"]', 'something')
    await setText('textarea[placeholder*="Write your article"]', 'wonderful')

    // action: set the tags
    const tags = await driver.findElement(By.css('input[placeholder="Enter tags"]'))
    for (const tag of ['a', 'b', 'c']) {
      await tags.sendKeys(tag, Key.ENTER)
    }

    // action: submit form
    await click('button[type=button]')
  }

  async function validatePost() {
    await waitFor('.article-content')

    await checkWindow('new-post')
  }

  async function addComment() {
    // action: set comment
    await setText('textarea', 'a comment')

    // action: submit comment
    await click('button[type=submit]')
  }

  async function validateComment() {
    await waitFor('div.card .card-block')

    await checkWindow('new-comment')
  }

  async function logout() {
    // action: goto settings page
    await driver.get('http://localhost:3000/settings')

    await waitFor('button.btn-outline-danger')

    // action: click logout button
    await click('button.btn-outline-danger')
  }

  async function validateBlog() {
    await driver.get('http://localhost:3000/')

    await checkWindow('anonymous-home-page')

    await click('.article-preview h1')
    await waitFor('.article-page')

    await checkWindow('anonymous-blog-post-view')
  }
})
