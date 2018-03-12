'use strict'
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const webdriver = require('selenium-webdriver')
require('chromedriver')
const {By, until} = webdriver

describe('registration page', function() {
  let driver
  before(async () => (driver = await new webdriver.Builder().forBrowser('chrome').build()))
  after(async () => await driver.quit())

  it('should not allow a blank email', async () => {
    await driver.get('http://localhost:3000/register')

    await driver.wait(until.elementLocated(By.css('input[placeholder=Username]')))

    const userNameField = await driver.findElement(By.css('input[placeholder=Username]'))
    await userNameField.sendKeys('aUsername')

    const passwordField = await driver.findElement(By.css('input[placeholder=Password]'))
    await passwordField.sendKeys('aPassword')

    const submit = await driver.findElement(By.css('button[type=submit]'))

    await submit.click()

    await driver.wait(until.elementLocated(By.css('[class=error-messages]')))

    const errorMessages = await driver.findElement(By.css('[class=error-messages]'))
    expect(await errorMessages.getText()).to.include("email can't be blank")
  })
})
