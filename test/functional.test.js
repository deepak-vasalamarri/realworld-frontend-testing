'use strict'
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const webdriver = require('selenium-webdriver')
require('chromedriver')

describe('registration page', function() {
  let driver
  before(async () => driver = await new webdriver.Builder().forBrowser('chrome').build())
  after(async () => await driver.quit())

  it('should not allow a blank email', async () => {

  })
})
