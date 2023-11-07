## 1. Introduction

HttpParrot is a manual API testing client for testing HTTP servers / REST services. It runs in Chrome browser as an extension.

### 1.1. Purpose

The purpose of this document is to describe in detail how HttpParrot functions including all technical details. The document also covers it's dependencies and limitations.

### 1.2. Scope

HttpParrot is a manual API testing client that runs as a chrome extension. The intended users are backend / API developers who want to test their REST APIs & testers who want to manually test web services based on HTTP protocol.

## 2. System Overview

This app runs in chrome as an extension so having chrome installed is fundamental requirement. It's using [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/) which is supported by Chrome 88 or later. App relies on Indexed DB as offline storage for saving application data.

### 2.1 Components

Following two are the 2 main components of the app,

#### Service Worker

Service worker is responsible for bootstrapping the application when user clicks the extension icon in extension toolbar. The service worker is performing following duties -

1.  Start the application in a new tab when user clicks the extension icon.
2.  Prevent duplication of the tab (Multiple tabs isn't supported at the moment).
3.  Intercept network requests and apply some rules on them before they are sent to the source.

#### UI

This is the core part of the application where user can make requests , see results, group requests into collections and save them for later use.

#### Storage

Indexed db is a NoSQL database available in chrome as well as other browsers, App is storing all user data offline in indexed object stores.

### 2.2 Technology Stack

The application is fully written in [TypeScript](https://www.typescriptlang.org/) and packaged using [Vite](https://vitejs.dev/) . Following are 3rd party dependencies ,

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Prism.js](https://prismjs.com/)
- [beautifier.io](https://beautifier.io/)
- [Mustache.js](https://mustache.github.io/)
- [mime-db](https://www.npmjs.com/package/mime-db)

All of the dependencies are included in the application package. Since app is storing all the user data offline in browser provided storage, it can function even when user is completely offline. Of course you wouldn't be able to test remove web services when offline but can still test locally running services.

### 2.3 Platform requirements

Only platform requirement is that user should have chrome version 88 or later.

## 3. Functional Requirements

---

### 3.1. Requests Configuration

- Users should be able select type of HTTP request they want to make out of GET, POST, PATCH , DELETE, PUT , OPTIONS, HEAD and custom.
- User should be able to easily add/remove/ update HTTP headers that would be included in request.
- User should be able to easily add / remove / update request bodies of type `json` , `text`, `formdata`, `url-encoded formdata` , `xml` , `file` etc.
- User should be able to make authenticated requests using `Bearer`, `Basic` and other frequently used authentication schemes.

### 3.2. Response

- User should be able to see response metadata such as Status , Size of response body and time table for web service to respond.
- User should be able to view text response of type - `json`, `html`, `xml`, `css`, `javascript`, `plain text`.
- User should get syntax highlighted and formatted text response for better readability.
- User should be able to copy text response to clipboard.
- User should be able to download binary response / files to their file system for which preview isn't available such as `pdf`, `zip`, `mp4`, `xls` etc.
- User should be able to discard / clear response section if they want to.
- User should be able to inspect response headers returned by web server.
- User should be able to cancel in flight requests if they want to.

### 3.3. Collections

- Users should be able to save request configuration and then update , delete them.
- Users should be able to create, update , delete collections to group saved requests & then able to add / remove requests from a collection, move to other collection etc.
- Saved data should persist between sessions.
- Saved data should be available even if user is offline.
- User should be able to import & export request collections to & from a file.

### 3.4. Tabs

- User should be able to create / update / delete multiple tabs where each tab should have it's own request configuration and response view.
- Opened tabs from last session should be visible in next session as is.

### 3.5. Collection Environment Variables.

- User should be able to create / update / delete environment variables for a collection.
- User should be able to use environment variables to substitute values in their request configuration.

### 3.6. History

- User should be able to view history of previously made requests.
- User should be able to view / load request made earlier / resend etc.
- History should persist between sessions.
- User should be able to clear the history in one click.

### 3.7. Searching & filtering

- User should be able to easily search through the history and saved requests / collections.

### 3.8. Code snippets

- User should be able to generate code snippets for a request configuration for various tools and languages such as `Go`, `C#`, `JavaScript`, `Node.js` , `Curl`, `fetch API`, `python`.

## 4. Non-functional Requirements

---

### 4.1. Performance

- The application should load fairly fast since most of the data is offline.

### 4.2. Security

- Since extension have elevated access, application should not hinder with functionality of other apps and overall functionality of browser.
- All application data should be offline and can be easily controller by user.

### 4.3. Offline Capability

- The app should be able to function in offline state for testing locally running web services.

## 5. Limitations

---

- Synching state across multiple sessions of tab isn't supported at the moment.
- Large response bodies ( > 20 Mb) will not be downloaded.

## 6. User Interface (UI)

---

### Main Page

![Main Page](/public/screenshots/tabs.PNG)

### History & Collections

![Collections](/public/screenshots/collections.PNG)

### Request configuration form

![Request Form](/public/screenshots/request_form.png)

### Response view

![Response View](/public/screenshots/response_view.png)

## 7. Data Model

---

Following are the core entities, data is stored offline in user's browser specifically in Indexed db.

### 7.1 Request Configuration Model

| Column           | type            | description                                            |
| ---------------- | --------------- | ------------------------------------------------------ |
| id               | uuid            | identifier                                             |
| url              | string          | request url                                            |
| method           | string          | http method                                            |
| name             | string          | name given to request                                  |
| headers          | Header[ ]       | request http headers                                   |
| collectionId     | string          | parent collection                                      |
| bodytype         | string          | type of request body                                   |
| created          | number          | time of creation                                       |
| triggered        | number          | time of last trigger                                   |
| formItems        | Fomdata[ ]      | form data body items                                   |
| query            | Query[ ]        | query string items                                     |
| textBody         | string          | text body content                                      |
| enableTextBody   | string          | include/exclude body                                   |
| loading          | boolean         | request status                                         |
| aborter          | AbortController | to abort request                                       |
| lock             | boolean         | for locking send button when request is in flight      |
| responseStatus   | string          | response status eg. (200 OK) or (400 Bad Request)      |
| responseTime     | string          | Time taken for web service to response                 |
| responseSize     | string          | Size of response body in Bytes                         |
| responseBody     | Uint8Array      | Body                                                   |
| responseBodyType | string          | Type of response body derived from Content-type header |
| responseHeaders  | Header [ ]      | response headers list                                  |
| responseOk       | boolean         | HTTP status success or failure                         |
| responseMimetype | string          | response body media type                               |

### 7.2 Header / Formdata / Query / Variable Models

| Column  | type    |
| ------- | ------- |
| id      | uuid    |
| name    | string  |
| value   | string  |
| enabled | boolean |

### 7.3 Collection Model

| Column    | type        |
| --------- | ----------- |
| id        | uuid        |
| name      | string      |
| variables | Variable[ ] |

### 7.4 Tab

| Column | type                  |
| ------ | --------------------- |
| id     | uuid                  |
| name   | string                |
| data   | Request Configuration |

### 7.5 MimeType Model

| column       | type       | description                                       |
| ------------ | ---------- | ------------------------------------------------- |
| id           | string     | media type e.g 'application/json'                 |
| source       | string     | source of the information                         |
| extensions   | string [ ] | standard file extensions of the type              |
| compressible | boolean    | whether or not the type of body can be compressed |
