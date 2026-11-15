# 08 — Design System

Decisions are recorded here as they're made. Exact values get tuned once the page layouts are built.

## Decided

| Decision | Choice | Notes |
|----------|--------|-------|
| Theme | **Light and dark** | Toggle in the navbar. First visit follows the device setting; the choice is then saved. Switching reveals the new theme in a circle growing from the toggle. |
| Mascot colour | **Orange fox** (classic red-fox colourway) | Fixed; the palette has to work with orange. See [10-mascot-character.md](10-mascot-character.md). |

## Colour

### How the palette is structured

| Role | Share of the page | Used for |
|------|-------------------|----------|
| Neutrals | ~85–90% | Background, cards, text, borders. Slightly tinted, never pure black on pure white. |
| Brand colour | ~8–10% | Buttons, links, "Hire me", focus rings. One colour only. |
| Fox orange | ~2% | The mascot, plus an occasional small highlight. |

### Palette (chosen): soft black and white + cobalt blue

Black and white lead; neither is pure, so the page is easy on the eyes. Cobalt blue is the personality colour, used sparingly.

| Token | Light (default) | Dark | Used for |
|-------|-----------------|------|----------|
| `canvas` | `#F6F6F3` warm off-white | `#121212` near-black | Page background |
| `paper` | `#FFFFFF` | `#1B1B1B` | Cards, the theme toggle |
| `ink` | `#1A1A1A` (16.1:1) | `#ECECEA` (15.8:1) | Main text, the name |
| `muted` | `#5C5C5A` (6.2:1) | `#A1A19E` (7.2:1) | Secondary text |
| `line` | `#E0E0DC` | `#2C2C2C` | Borders, dividers |
| `accent` | `#2747E6` cobalt (6.2:1) | `#7B93FF` (6.7:1) | Personality touches |
| `accent-soft` | `#E5E9FD` | `#1A2147` | Tinted backgrounds (tags, highlights) |

Where the blue appears (keep it to small touches, roughly 5% of the page):
- Availability dot and its pulse
- Nav link underline on hover
- A letter of the hero name turns blue as it lifts on hover
- The running line in the Scroll cue
- Theme toggle: hover, focus ring and the burst ring
- Text selection highlight

Light/dark: `data-theme="dark"` on `<html>`; toggle at the right of the navbar.


### Rules
- Body text and buttons must meet WCAG AA contrast (4.5:1).
- Colours are defined once as Tailwind tokens in the `@theme` block of `src/styles/index.css`; components use the token classes (`text-ink`, `bg-accent`), never raw hex values.

## Typography

| Role | Font | Tailwind class | Status |
|------|------|----------------|--------|
| Display | Dirtyline 36daysoftype 2022 | `font-display` | Installed, self-hosted |
| Body (default) | Chillax, variable 200–700 | `font-sans` | Installed, self-hosted |
| Mono | System monospace for now | `font-mono` | 3rd font still to choose |

## Still to decide
- [x] Palette: soft black and white + cobalt blue, light and dark themes
- [ ] Third font (mono)
- [ ] Spacing scale and corner radius
- [ ] Animation style (page transitions, scroll reveals, hover states)
