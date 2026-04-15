# Resume Builder

A web app for creating, editing, and exporting professional resumes with live preview and PDF download.

## What it does

Build and manage multiple resume variants in the browser. Edit your content in a sidebar, see changes reflected instantly in an A4 preview, then download as PDF. All data is saved automatically to localStorage — no account required.

## Features

**Content editing**
- Personal details (name, title, email, phone, address, photo)
- Professional summary
- Employment history with bullet points per entry
- Education entries
- Certifications
- Skills and languages with proficiency levels
- Custom links (LinkedIn, GitHub, portfolio, etc.)
- Hobbies and interests

**Multi-resume management**
- Create, rename, duplicate, and delete resumes
- Each resume stores its own data and template selection independently

**Templates**
- Classic — sidebar-right layout
- Modern — sidebar-left layout
- Minimal — single-column layout

**Editing experience**
- Live A4-sized preview alongside the editor
- Full-page preview modal
- Drag-and-drop reordering of sections
- Undo / Redo (Ctrl+Z / Ctrl+Shift+Z or Ctrl+Y) with debounced history
- Sample data to get started quickly

**Export**
- Download resume as PDF (filename based on your name)
- PDF output matches the selected template

**Persistence**
- Auto-saves to localStorage with 500ms debounce
- Automatic migration from legacy single-resume format

## Tech stack

| Area | Library |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Drag and drop | @dnd-kit |
| PDF generation | @react-pdf/renderer |
| Unit tests | Vitest + Testing Library |
| E2E tests | Playwright |

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

```bash
yarn test        # unit tests
yarn test:e2e    # Playwright end-to-end tests
yarn build       # production build
```
