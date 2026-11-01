# MarketHubUI

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Backend authentication and profiles

Run the MarketHub gateway at `http://localhost:8080`, then run `npm run dev`.
Vite proxies `/api` to the gateway. For production, route `/api` to the gateway,
or set `VITE_API_BASE_URL` to its public URL at build time and allow the frontend
origin in the gateway CORS configuration. Never put secrets in Vite variables.

Registration requires a unique username (3–32 ASCII letters, digits, `_`, `.`, `-`),
email, and an 8–72 character password. After creating an account, log in using
its username or email. Profiles may take a few seconds to appear after registration.
Account → Settings edits the display name, avatar URL, and optional E.164 phone.
Username and email are read-only because the backend provides no update endpoints.

Tokens are stored in browser session storage, restored on reload, refreshed on a
401 response, and revoked on logout. Session storage is accessible to JavaScript;
a future backend cookie session would allow HttpOnly token storage.
Google/Apple sign-in and password recovery need backend endpoints before they can
be offered. Listings, favorites, and messages still use the existing demo data.

Run `node --test tests/auth.test.mjs` for mocked authentication lifecycle checks
and `npm run build` for type checking and the production build.
