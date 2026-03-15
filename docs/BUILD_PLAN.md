# Yetis Ustam Build Plan

This roadmap keeps feature-branch work clear for two developers. Keep branches small, merge in order when a dependency exists, and split work in parallel only after the blocking branch is merged.

## Status Legend

- `completed`: merged and done
- `next`: ready to start now
- `planned`: queued behind earlier work

## Phase 1: Foundation

| Branch | Focus | Suggested Lane | Status |
| --- | --- | --- | --- |
| `feature/expo-bootstrap` | Expo + TypeScript bootstrap | Shared | completed |
| `feature/navigation-shell` | Basic screen flow | Shared | completed |
| `feature/game-grid` | Initial 6x6 board | Core UI | completed |
| `feature/pipe-types` | Typed pipe system | Core logic | completed |
| `feature/path-validation` | Core path validation utilities | Core logic | completed |

## Phase 2: Level Data Foundation

| Order | Branch | Focus | Suggested Lane | Status |
| --- | --- | --- | --- | --- |
| 1 | `feature/level-schema` | Define typed level shape and authoring format | Core logic | next |
| 2 | `feature/level-loader` | Load level data into the game board | Core logic | planned |
| 3 | `feature/source-target-system` | Add source and target cells to gameplay state | Core logic | planned |

## Phase 3: Core Game Flow

| Order | Branch | Focus | Suggested Lane | Status |
| --- | --- | --- | --- | --- |
| 4 | `feature/need-timer` | Add basic countdown / pressure mechanic | Core logic | planned |
| 5 | `feature/win-lose-flow` | Connect gameplay result to win and lose states | Shared | planned |
| 6 | `feature/star-scoring` | Add simple end-of-level scoring | Core logic | planned |

## Phase 4: Main Game Screen Layout

| Order | Branch | Focus | Suggested Lane | Status |
| --- | --- | --- | --- | --- |
| 7 | `feature/game-layout-refactor` | Reshape the game screen for real HUD layout | UI | planned |
| 8 | `feature/house-view` | Add the house-side visual area | UI | planned |
| 9 | `feature/bottom-tray` | Add bottom tray for pipe inventory / controls | UI | planned |

## Phase 5: Playable Content

| Order | Branch | Focus | Suggested Lane | Status |
| --- | --- | --- | --- | --- |
| 10 | `feature/world1-levels` | First set of real levels | Content | planned |
| 11 | `feature/world2-levels` | Second level pack | Content | planned |
| 12 | `feature/tutorial-flow` | Basic onboarding for first-time players | Shared | planned |

## Phase 6: Feedback and Polish

| Order | Branch | Focus | Suggested Lane | Status |
| --- | --- | --- | --- | --- |
| 13 | `feature/sfx` | Sound effects hooks and assets | Audio / Polish | planned |
| 14 | `feature/bgm` | Background music support | Audio / Polish | planned |
| 15 | `feature/water-flow-feedback` | Visual feedback for successful flow | UI / Polish | planned |
| 16 | `feature/ui-polish` | Final pass on spacing, clarity, and feedback | Shared | planned |

## Practical Notes For Two Developers

- Start with `feature/level-schema`. It unlocks the next gameplay branches cleanly.
- After `feature/level-schema` merges, one developer can take `feature/level-loader` while the other starts `feature/source-target-system`.
- After `feature/win-lose-flow` is merged, `feature/star-scoring` becomes a safer follow-up.
- After `feature/game-layout-refactor` lands, `feature/house-view` and `feature/bottom-tray` can move in parallel.
- Content and polish branches should stay behind the core gameplay data flow to reduce rework.
