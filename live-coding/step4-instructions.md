# Step3 - Adding cloud-based (Applitools Eyes) screenshot validations

* Add Applitools Eyes initialization

```js
  let eyes
  before(async () => {
    eyes = new Eyes()
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)

    await eyes.open(driver, 'Test', 'Realworld', {width: 800, height: 600})
  })
  after(async () => await eyes.close())
```

* Change checkWindow to use `eyes.checkWindow`

```js
  async function checkWindow(baseImageName) {
    await eyes.checkWindow(baseImageName)
  }
```

* Run and test it

```sh
$ npm test
...
```

* It passes
* Now let's add a "bug" in `Register.js`

```js
  onSubmit: (username, email, password) => {
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'username', value: '' }) // add this line
    const payload = agent.Auth.register(username, email, password);
    dispatch({ type: REGISTER, payload })
```

* Now let's build && rerun:

```sh
$ npm run build && npm test
...
```

* It fails! We'll fix the bug by removing that line, and change the header.
* Change "Home" in `Header.s` to "StartHere" (twice)
* Now let's build & rerun:

```sh
$ npm run build && npm test
...
```

* Applitools shows a bug in all the pages.
* Click on the grouping icon, and you will get two groupings: header for logged in and anonymous user.
