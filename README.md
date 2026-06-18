# Who Won The Year

A host-driven, 64-entry bracket game to settle who *really* won the year. Built
for an end-of-year tradition: a March-Madness-style field of people, things, and
concepts (Donald Trump vs. Jeffrey Epstein, natural disasters, Taylor Swift…) —
deliberately no judging criteria, just organized chaos.

## How the game works

- **Field of 64.** Enter base contenders plus optional **play-in** matchups; each
  play-in winner joins the field to complete the 64.
- **Pick rounds (Round of 64 & 32).** No vote — players take turns in a rotating
  order; whoever's turn it is picks the winner. The app shows whose turn it is.
- **Voting rounds (Sweet 16 → Championship).** Each matchup goes to a group vote.
  Every player gets **one veto for the whole game**: an impassioned 2-minute
  argument, 2-minute counter, then the vote. The app tracks vetoes and has a
  built-in timer.
- **Champion.** Last entry standing won the year.

This is **v1: host-driven** — one device drives the bracket and records picks and
votes. Live phone-based voting is a planned future phase.

## Tech

- Vite + React + TypeScript, Tailwind CSS
- State persisted to `localStorage` (one bracket at a time; survives refresh)
- Fully static — deploys to GitHub Pages, no backend

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + static build to dist/
npm run preview  # serve the production build
```

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys on push to `main`. Enable it once:
**Settings → Pages → Build and deployment → Source: GitHub Actions**. The site
serves under `/whowontheyear/` (set via `base` in `vite.config.ts`).

## Roadmap

- Live phone voting / join-a-room (Firebase or P2P)
- Multi-year history & archive of past champions
- Public accounts
