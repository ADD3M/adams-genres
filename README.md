# Adams Genres

Adams Genres is a mobile-first React + Vite app for generating electric-guitar-friendly genre and subgenre prompts.
It is packaged for Android using Capacitor, with a touch-friendly interface and local persistence.

## Overview
- Generate guitar practice prompts by rolling genres and subgenres.
- Lock a genre for focused results.
- Copy the current prompt to clipboard.
- Save recent rolls and restore them with a tap.
- Works well on mobile and also supports desktop keyboard shortcuts.

## Features
- Mobile-friendly UI with touch controls
- Genre lock dropdown
- Reroll button and "Reroll subgenre" button
- Recent roll history with restore-on-tap
- Toast feedback for actions
- Local storage persistence
- Supports `Space` = reroll and `C` = copy on desktop
- Capacitor Android packaging support

## Usage
1. Open the app.
2. Choose a genre or leave it on `Any`.
3. Tap **Reroll** to generate a new genre + subgenre.
4. Tap **Reroll subgenre** to keep the current genre and refresh only the subgenre.
5. Tap **Copy** to copy the current prompt.
6. Tap a history item to restore that roll.
7. Tap **Clear** to empty the history.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the URL shown by Vite in your browser.

## Build

```bash
npm run build
```

The production build is output to `dist/`.

## Lint

```bash
npm run lint
```

## Android / Capacitor
This repo uses Capacitor to package the web app as an Android app.

Native Android files are located in `android/`.

To refresh Android assets after changing web code:

```bash
npm run build
npx cap copy android
```

To sync native plugin changes:

```bash
npx cap sync android
```

> Only edit `android/` when making platform-specific native changes.

## Project structure

- `src/App.jsx` — main app logic, genre data, UI, persistence, and mobile behavior
- `src/main.jsx` — React bootstrapping
- `src/index.css` — Tailwind CSS entrypoint
- `vite.config.js` — Vite config
- `tailwind.config.js` — Tailwind config
- `eslint.config.js` — ESLint config
- `capacitor.config.json` — Capacitor metadata
- `android/` — generated Android wrapper

## Notes
- `src/App.css` exists but is not used.
- `dist/` is build output and should not be committed.
- The app is intentionally plain JavaScript/JSX; do not convert to TypeScript unless requested.
