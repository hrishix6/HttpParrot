<h1 style="display:flex; align-items:center; gap:5px; justify-content:center;">
    <img style="display:block" src="./public/icons/icon48.png">
    <span style="display:block">HttpClient</span>
</h1>

<p style="text-align:center">API testing tool baked right into chrome</p>

## Built using

- [vite](https://vitejs.dev/)
- [react](https://react.dev/)
- [tailwindcss](https://tailwindcss.com/)
- [shadcn ui](https://ui.shadcn.com/)
- [prismjs](https://prismjs.com/)
- [beautifier.io](https://beautifier.io/)
- [handlebars](https://handlebarsjs.com/)

## What's implemented

- sending request with any method, url.
- editable json/text/xml/formdata/urlencoded body
- format text responses with highlighting (json, xml, html, js, css)
- show response metadata (response status, time, size).
- handle binary response (zip, audio, video, pdf, images).
- save request history to persist between sessions.
- save requests with name.

`If you have got some feature ideas, create an issue, it would be fun exercise, Working on below now`

## Todo

- request collections
- Basic / Bearer authentication
- import/export collections
- generate code snippets for various languages for making request(eg, curl, node, C# etc)
- generate OpenAPI spec for collection
- add variables support to collection so user can set some defaults and then use them in requests.

## Screeshots

- Light mode

  <img style="display:block" src="./public/screenshots/ui-light.PNG" alt="light mode">

- Dark mode

  <img style="display:block" src="./public/screenshots/ui-dark.PNG" alt="dark mode">

- HTML/xml response view

  <img style="display:block" src="./public/screenshots/html-res.PNG" alt="html or xml response">

- JSON response view

  <img style="display:block" src="./public/screenshots/json-res.PNG" alt="json response">

- binary file response view

  <img style="display:block" src="./public/screenshots/binary-res.PNG" alt="file response">

- error response view

  <img style="display:block" src="./public/screenshots/error-res.PNG" alt="error response">

## How to use

- clone this repository

- install `node >= 16.x.x`

- install dependencies

  ```bash
  $ npm install
  ```

- build
  ```bash
  $ npm run build
  ```
- open `dist` folder in chrome extensions using `Load unpacked` button (make sure you have developer mode on).

- <p style="display:flex; align-items:center; gap:3px;">
   <span style="display:block"> you should see an extension icon in toolbar, click the extension icon -> </span>
   <img style="display:block" src="./public/icons/icon16.png">
  </p>

- exntension relies on `indexed db` to store data, make sure you have reasonably updated version of chrome.

## Contributions

- This is personal project that I am building just for fun and learning, not planning to publish.
- If you are still interested in contributing, pick up an issue and send PR.

## License

MIT
