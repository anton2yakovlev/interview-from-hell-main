# CLAUDE.md

## Project Overview
This repository contains a small fullstack browser game called **Interview From Hell**.

The game is a Russian-language interactive story about a graphic designer going through a job interview at **Сбер**. At first, the interview feels normal and corporate, but gradually it becomes surreal, psychologically strange, and disturbing.

The game must:
- work directly in the browser,
- require no registration,
- allow immediate play,
- remain small, atmospheric, and easy to maintain.

---

## Core Product Rules
Always preserve these product constraints:

1. The game must be in Russian
2. The game must be playable without registration
3. The player must be able to start immediately
4. The project must stay within MVP scope
5. The tone must feel like a strange corporate design interview
6. The UI should feel atmospheric, dark, minimal, and readable

Do not introduce features that conflict with these constraints.

---

## Tech Stack
### Backend
- FastAPI

### Frontend
- React
- Vite
- TypeScript

### Infra
- Docker
- Docker Compose

---

## Architecture Principles

### General
- Keep the project simple.
- Prefer clarity over abstraction.
- Do not overengineer.
- Keep backend and frontend clearly separated.
- Use a monorepo layout:
  - `/backend`
  - `/frontend`

### Backend
- Organize code into:
  - `api`
  - `schemas`
  - `services`
  - `data`
- Scenario content should be treated as structured game data, not hardcoded inside route handlers.
- Route handlers should remain thin.
- Business logic should live in services.
- Add a health check endpoint.
- Keep configuration in environment variables.
- Add CORS configuration.

### Frontend
- Use React functional components.
- Use TypeScript strictly.
- Use React Router.
- Keep components small and focused.
- Keep API access centralized.
- Explicitly handle loading and error states.
- Store progress in `localStorage`.
- Do not require login or server-side sessions for MVP.

---

## MVP Scope
Implement only the following unless explicitly asked otherwise:

1. Landing page
2. Start game button
3. Scene rendering
4. Choice selection
5. Scene transitions
6. Multiple endings
7. Progress saving in localStorage
8. Restart flow
9. Atmospheric dark UI
10. Dockerized local setup
11. README

Do not add:
- user accounts
- authentication
- chat system
- admin panel
- multiplayer
- payments
- achievements
- analytics dashboard
- CMS
- database unless clearly needed
- unnecessary animation libraries

---

## Story Rules
The game story must follow these principles:

1. Everything is written in Russian
2. The setting is graphic design / job interview / corporate communication / branding / revisions / approval chains
3. The beginning should feel realistic
4. The middle should introduce subtle anomalies
5. The ending should become surreal, oppressive, or psychologically strange
6. Choices should feel meaningful
7. The tone should mix:
   - corporate polish
   - design culture
   - absurd feedback
   - system horror

Avoid:
- excessive gore
- explicit sexual content
- chaotic humor that destroys immersion

---

## Narrative Structure
Prefer a branching structure with:
- 10–15 scenes for MVP
- 2–4 choices per scene
- 3–5 endings

Scene data should be structured and easy to edit.

Each scene should have:
- unique id
- scene type
- speaker
- text
- list of choices

Each choice should have:
- id
- text
- next scene id
- optional flags or effects if needed

---

## UI Direction
The visual style should be:
- dark
- minimal
- readable
- slightly ominous
- corporate
- polished

Use:
- strong typography
- system / enterprise interface details
- restrained green accents
- subtle visual tension

Avoid:
- cluttered layouts
- overly bright palette
- noisy glitch effects everywhere
- meme aesthetics unless specifically requested

---

## Data and State
For MVP:
- story content can be stored as structured JSON or Python data
- player progress should be stored in browser localStorage
- backend does not need authentication
- backend does not need persistent player accounts

Keep state handling simple and transparent.

---

## Workflow
When asked to make changes:

1. Inspect the current code
2. Make a short plan
3. Implement the smallest correct change
4. Keep frontend and backend consistent
5. Update README if setup or behavior changes

Avoid unrelated refactors.

---

## Code Style
- Prefer readable names
- Avoid deep nesting
- Keep files focused
- Add comments only where useful
- Do not introduce premature abstractions
- Favor maintainable code over clever code

---

## Testing / Validation
When making meaningful changes:
- verify backend endpoints match frontend expectations
- verify scene transitions are valid
- verify localStorage persistence still works
- verify restart flow works
- verify Russian text displays correctly
- verify Docker setup still works

If tests exist, run them.
If tests do not exist, at least validate critical game flow manually.

---

## Definition of Done
A task is done when:
- the game flow works,
- scene transitions are coherent,
- frontend and backend are aligned,
- Russian text is correct,
- the app remains registration-free,
- the solution stays within MVP scope,
- docs are updated if needed.
