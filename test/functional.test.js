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

  it('should not allow a blank email', async () => {
    // action: browse to registration page
    await driver.get('http://localhost:3000/register')

    await driver.wait(until.elementLocated(By.css('input[placeholder=Username]')))

    // action: set username and password to something, but leave email blank
    const userNameField = await driver.findElement(By.css('input[placeholder=Username]'))
    await userNameField.sendKeys('aUsername')

    const passwordField = await driver.findElement(By.css('input[placeholder=Password]'))
    await passwordField.sendKeys('aPassword')

    // action: submit form
    const submit = await driver.findElement(By.css('button[type=submit]'))
    await submit.click()

    // validate: there is an error message
    await driver.wait(until.elementLocated(By.css('.error-messages')))

    const errorMessages = await driver.findElement(By.css('.error-messages'))

    expect(await errorMessages.getText()).to.include("email can't be blank")
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
    const userNameField = await driver.findElement(By.css('input[placeholder=Username]'))
    await userNameField.sendKeys('ausername')

    const passwordField = await driver.findElement(By.css('input[placeholder=Password]'))
    await passwordField.sendKeys('aPassword')

    const emailField = await driver.findElement(By.css('input[placeholder=Email]'))
    await emailField.sendKeys('an@email.com')

    // action: submit form
    const submit = await driver.findElement(By.css('button[type=submit]'))
    await submit.click()
  }

  async function validateUserHomePage() {
    await driver.wait(until.elementLocated(By.css('img[alt=ausername]')))

    const usernameField = await driver.findElement(By.css('a[href="/@ausername"]'))
    expect(await usernameField.getText()).to.equal('ausername')

    const articlesList = await driver.findElement(By.css('.article-preview'))
    const t = await articlesList.getText()
    expect(await articlesList.getText()).to.equal('No articles are here... yet.')

    const yourFeedTab = await driver.findElement(By.css('.nav-link.active'))
    expect(await yourFeedTab.getText()).to.equal('Your Feed')
  }

  async function publishPost() {
    const newPost = await driver.findElement(By.partialLinkText('New Post'))
    await newPost.click()

    await driver.wait(until.elementLocated(By.css('input[placeholder="Article Title"]')))

    const title = await driver.findElement(By.css('input[placeholder="Article Title"]'))
    await title.sendKeys('a title')

    const description = await driver.findElement(
      By.css('input[placeholder="What\'s this article about?"]'),
    )
    await description.sendKeys('something')

    const article = await driver.findElement(By.css('textarea[placeholder*="Write your article"]'))
    await article.sendKeys('wonderful')

    const tags = await driver.findElement(By.css('input[placeholder="Enter tags"]'))
    for (const tag of ['a', 'b', 'c']) {
      await tags.sendKeys(tag, Key.ENTER)
    }

    const newPostButton = await driver.findElement(By.css('button[type=button]'))
    await newPostButton.click()
  }

  async function validatePost() {
    await driver.wait(until.elementLocated(By.css('h1')))

    const title = await driver.findElement(By.css('h1'))
    expect(await title.getText()).to.equal('a title')

    const article = await driver.findElement(By.css('div.article-content'))
    expect(await article.getText()).to.include('wonderful')

    const tags = await driver.findElement(By.css('ul.tag-list'))
    expect(await tags.getText()).to.equal('abc')
  }

  async function addComment() {
    const commentInput = await driver.findElement(By.css('textarea'))
    await commentInput.sendKeys('a comment')

    const submitButton = await driver.findElement(By.css('button[type=submit]'))
    await submitButton.click()
  }

  async function validateComment() {
    await driver.wait(until.elementLocated(By.css('div.card .card-block')))

    const comment = await driver.findElement(By.css('div.card .card-block'))
    expect(await comment.getText()).to.equal('a comment')

    const username = await driver.findElement(By.css('div.card a.comment-author:nth-child(2)'))
    expect(await username.getText()).to.equal('ausername')
  }

  async function logout() {
    await driver.get('http://localhost:3000/settings')

    await driver.wait(until.elementLocated(By.css('button.btn-outline-danger')))

    const logoutButton = await driver.findElement(By.css('button.btn-outline-danger'))
    await logoutButton.click()
  }

  async function validateBlog() {
    await driver.get('http://localhost:3000/')

    const postUsername = await driver.findElement(By.css('a.author'))
    expect(await postUsername.getText()).to.equal('ausername')

    const postTitle = await driver.findElement(By.css('.article-preview h1'))
    expect(await postTitle.getText()).to.equal('a title')

    const postDescription = await driver.findElement(By.css('.article-preview h1 + p'))
    expect(await postDescription.getText()).to.equal('something')

    const postTags = await driver.findElement(By.css('.article-preview ul'))
    expect(await postTags.getText()).to.equal('abc')

    const popularTags = await driver.findElement(By.css('.sidebar .tag-list'))
    expect(await popularTags.getText()).to.equal('abc')

    await postTitle.click()
    await driver.wait(until.elementLocated(By.css('.article-page')))

    const title = await driver.findElement(By.css('h1'))
    expect(await title.getText()).to.equal('a title')

    const article = await driver.findElement(By.css('div.article-content p'))
    expect(await article.getText()).to.equal('wonderful')

    const tags = await driver.findElement(By.css('ul.tag-list'))
    expect(await tags.getText()).to.equal('abc')

    // ...
  }
})
