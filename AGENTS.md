# AI Agent Instructions for adams-genres

## What this repo is
- A small React + Vite frontend app.
- Uses Tailwind CSS for styling.
- Built as a mobile-friendly app and packaged for Android with Capacitor.
- The main app logic lives in `src/App.jsx`.

## Key files and intent
- `src/App.jsx` - application logic, genre/subgenre data, UI, reroll + copy behavior.
- `src/main.jsx` - React bootstrapping.
- `vite.config.js` - Vite setup.
- `tailwind.config.js` - Tailwind content config.
- `eslint.config.js` - linting rules.
- `capacitor.config.json` - Capacitor Android app metadata.
- `android/` - generated Capacitor Android wrapper.

## Build and development commands
- `npm install` to install dependencies.
- `npm run dev` to start the Vite development server.
- `npm run build` to build the production web app.
- `npm run lint` to run ESLint.

## Important notes for edits
- The repo is plain JavaScript and JSX; do not introduce TypeScript unless the user asks.
- `src/App.css` is present but not imported by the app.
- `dist/` and generated Android build output are ignored by `.gitignore`.
- `android/` is Capacitor-managed. Prefer web app changes in `src/` and use Capacitor tooling for native sync.
- The `DATA` constant in `src/App.jsx` is the app's source of genres/subgenres.
- `src/App.jsx` now persists selected genre, current roll, and recent history in `localStorage`.
- The app also supports keyboard shortcuts (Space = reroll, C = copy), in-app toast feedback, a dedicated "Reroll subgenre" action, and history item restore.

## Recommendations for AI agents
- Keep changes small and centered in `src/App.jsx` unless adding a broader app structure.
- Use Tailwind utility classes for styling consistency.
- Avoid touching generated files in `android/` unless explicitly requested.
- If adding features, preserve the simple single-page app model unless the user requests a deeper architecture.

## Handling context resets
- If the chat context is reset, re-read this file before making changes.
- The main app logic is in `src/App.jsx`; start there for feature work.
- For build or dev tasks, use `npm install`, `npm run dev`, `npm run build`, and `npm run lint`.
- Do not assume native Android files are hand-maintained; only change `android/` when the user explicitly requests native or Capacitor updates.

## What this file is for
This file exists so AI agents understand the repo shape quickly and can avoid chasing generated or template files.
