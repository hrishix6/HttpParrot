<h1 style="display:flex; align-items:center; gap:5px; justify-content:center;">
    <img src="./public/logo.svg" alt="logo">
    <span style="display:block">HttpParrot</span>
</h1>

<p style="text-align:center">API testing tool baked right into chrome</p>

## Motivation

Didn't like Postman's decision to move everything online with no offline option, not very fond of other tools, decided to roll my own lightweight tool. It has become a fun little side project.

## Spec

You can read the full specification [here](/spec.md)

## Built using

- [vite](https://vitejs.dev/)
- [react](https://react.dev/)
- [tailwindcss](https://tailwindcss.com/)
- [shadcn ui](https://ui.shadcn.com/)
- [prismjs](https://prismjs.com/)
- [beautifier.io](https://beautifier.io/)
- [Mustache.js](https://mustache.github.io/)
- [mime-db](https://www.npmjs.com/package/mime-db)

## Features

- **Intuitive UI**.
- **Configure all aspects of request**.
- **Editable & configurable body (text, json, xml, formdata, x-url-encoded-formdata)**.
- **Formatted & highlighted preview of text responses. (json, xml, html, js, css)**.
- **Response metadata (status, time, size)**.
- **Downloadable binary response (zip, audio, video, pdf, images and so on)**.
- **Reusable request history**.
- **Request collections - group and save requests**.
- **Completely offline storage, all your data is offline in the browser**.
- **Environment variables for collections**.
- **Import & export collections**.

## Some feature Ideas (TODO)

- ~~Cookie handling~~ (not possible as browsers don't allow reading cookies in content scripts).
- Basic / Bearer authentication.
- generate code snippets for various languages for making request(eg, curl, node, C# etc).
- generate OpenAPI spec for collection.
- pre-run/ post run scripts (run something before or after running specific requests).
- collection runner.

## Screeshots

<img style="display:block" src="./public/screenshots/tabs.PNG" alt="ui">

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

- exntension relies on `indexed db` to store data , please use reasonably update browser.

## Contributions

I'm working on this as a personal project purely for the joy of learning, with no intentions of publishing it.
If you're still enthusiastic about contributing, feel free to select an issue and submit a pull request.

## License

MIT
