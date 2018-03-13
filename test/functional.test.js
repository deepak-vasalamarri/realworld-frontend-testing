'use strict'
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const webdriver = require('selenium-webdriver')
require('chromedriver')
const {By, until, Key} = webdriver

describe('registration page', function() {
  let driver
  before(async () => (driver = await new webdriver.Builder().forBrowser('chrome').build()))
  after(async () => await driver.quit())

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

  async function getText(selector) {
    const element = await driver.findElement(By.css(selector))

    return await element.getText()
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

    expect(await getText('.error-messages')).to.include("email can't be blank")
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
    await waitFor('img[alt=ausername]')

    // validate username
    expect(await getText('a[href="/@ausername"]')).to.equal('ausername')

    // validate articles list
    expect(await getText('.article-preview')).to.equal('No articles are here... yet.')

    // validate active tab
    expect(await getText('.nav-link.active')).to.equal('Your Feed')
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
    await waitFor('h1')

    // validate title
    expect(await getText('h1')).to.equal('a title')

    // validate article content
    expect(await getText('.article-content')).to.include('wonderful')

    // validate tags
    expect(await getText('.tag-list')).to.equal('abc')
  }

  async function addComment() {
    // action: set comment
    await setText('textarea', 'a comment')

    // action: submit comment
    await click('button[type=submit]')
  }

  async function validateComment() {
    await waitFor('div.card .card-block')

    // validate comment text
    expect(await getText('div.card .card-block')).to.equal('a comment')

    // validate comment username
    expect(await getText('div.card a.comment-author:nth-child(2)')).to.equal('ausername')
  }

  async function logout() {
    // action: goto settings page
    await driver.get('http://localhost:3000/settings')

    await waitFor('button.btn-outline-danger')

    // action: click logout button
    await click('button.btn-outline-danger')
  }

  async function validateBlog() {
    // goto home page
    await driver.get('http://localhost:3000/')

    // validate post author
    expect(await getText('a.author')).to.equal('ausername')

    // validate post title
    expect(await getText('.article-preview h1')).to.equal('a title')

    // validate post description
    expect(await getText('.article-preview h1 + p')).to.equal('something')

    // validate post tags
    expect(await getText('.article-preview ul')).to.equal('abc')

    // validate popular tags
    expect(await getText('.sidebar .tag-list')).to.equal('abc')

    // action: goto post page
    await click('.article-preview h1')
    await waitFor('.article-page')

    // validate post title
    expect(await getText('h1')).to.equal('a title')

    // validate article description
    expect(await getText('div.article-content p')).to.equal('wonderful')

    // validate article tags
    expect(await getText('ul.tag-list')).to.equal('abc')

    // ...
  }
})
