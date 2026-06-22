---
version: alpha
name: Geist
description: Vercel's Geist design system, Dark theme (the Light theme values are preserved in design.light.md).
colors:
  primary: "#ededed"
  secondary: "#a1a1a1"
  tertiary: "#0070f3"
  neutral: "#1a1a1a"
  background-100: "#0a0a0a"
  background-200: "#000000"
  gray-100: "#1a1a1a"
  gray-200: "#1f1f1f"
  gray-300: "#292929"
  gray-400: "#333333"
  gray-500: "#444444"
  gray-600: "#666666"
  gray-700: "#888888"
  gray-800: "#999999"
  gray-900: "#a1a1a1"
  gray-1000: "#ededed"
  gray-alpha-100: "#ffffff0a"
  gray-alpha-200: "#ffffff14"
  gray-alpha-300: "#ffffff1a"
  gray-alpha-400: "#ffffff1f"
  gray-alpha-500: "#ffffff36"
  gray-alpha-600: "#ffffff3d"
  gray-alpha-700: "#ffffff70"
  blue-700: "#0070f3"
  red-800: "#e5484d"
  green-700: "#46a758"
typography:
  heading-32:
    fontFamily: Geist Sans
    fontSize: 32px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -1.28px
  heading-24:
    fontFamily: Geist Sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.96px
  heading-20:
    fontFamily: Geist Sans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 26px
    letterSpacing: -0.4px
  heading-16:
    fontFamily: Geist Sans
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: -0.32px
  button-14:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  label-14:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-13:
    fontFamily: Geist Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 16px
  label-12:
    fontFamily: Geist Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  copy-14:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  copy-13:
    fontFamily: Geist Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
  label-14-mono:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
spacing:
  base: 4px
rounded:
  sm: 6px
  md: 12px
  lg: 16px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background-100}"
    height: 40px
  button-secondary:
    backgroundColor: "{colors.background-100}"
    textColor: "{colors.primary}"
    height: 40px
  input:
    backgroundColor: "{colors.background-100}"
    textColor: "{colors.primary}"
    height: 40px
---

# Geist

## Overview

Geist is Vercel's design system for building consistent, developer-focused interfaces. The aesthetic is minimal and high-contrast: plenty of whitespace, restrained color, and content set on near-neutral surfaces. Prioritize readability and accessibility, and use color to signal state or hierarchy rather than decoration.

This is the Dark theme. The Light theme uses the same token names with different values; see `design.light.md` if you add a light variant. Colors are sRGB hex with Display P3 equivalents.

## Colors

Each non-background scale runs 10 steps (`100`–`1000`), and the step encodes intent, not just lightness:

- `100` default background
- `200` hover background
- `300` active background
- `400` default border
- `500` hover border
- `600` active border
- `700` solid fill, high contrast
- `800` solid fill, hover
- `900` secondary text and icons
- `1000` primary text and icons

`background-100` is the primary page and card surface; `background-200` is a secondary surface for subtle separation. The `gray-alpha-*` tokens are translucent, so they layer over any background; use them for borders, dividers, overlays, and hover states. Solid `gray-*` holds its contrast on any surface, so use it for text and opaque fills. Accent scales carry meaning: `blue` for success, links, and focus; `red` for errors; `amber` for warnings; plus `green`, `teal`, `purple`, and `pink`. Use the hex tokens everywhere; each accent scale also ships a `*-p3` wide-gamut value in `oklch()` for Display P3 screens. The Dark theme redefines the same names at `/design.dark.md`.

## Typography

Geist Sans sets UI and prose; Geist Mono sets code, data, and tabular figures. Both are open-source. The `typography` tokens above carry concrete `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, and `letterSpacing`:

- Headings, `heading-72` through `heading-14`, title pages and sections; `letterSpacing` tightens as the size grows.
- Labels, `label-20` through `label-12`, carry single-line, scannable text: navigation, form labels, table headers, metadata.
- Copy, `copy-24` through `copy-13`, set multi-line body text with a taller `lineHeight`.
- Buttons, `button-16` through `button-12`, are medium-weight labels for buttons and compact controls.

`copy-14` and `label-14` cover most text. The `-mono` tokens pair Geist Mono with the same metrics; prefer tabular figures when numbers need to align.

## Layout

Spacing follows a 4px scale: 4, 8, 12, 16, 24, 32, 40, 64, 96px. Keep a three-step rhythm: 8px inside a group, 16px between groups, 32–40px between sections. Cards use 24px padding, 16px when compact and 32px for hero areas. Center content in a 1200px column with side padding that grows at wider breakpoints, and make every layout work on mobile and desktop. Breakpoints are `sm` 401px, `md` 601px, `lg` 961px, `xl` 1200px, and `2xl` 1400px.

## Elevation & Depth

Hierarchy comes from tonal surfaces and borders first, so shadows stay subtle. Apply these values for the dark theme:

- Raised cards: `0 0 0 1px rgba(255, 255, 255, 0.12)`
- Popovers and menus: `0 0 0 1px rgba(255, 255, 255, 0.12), 0 8px 30px rgba(0, 0, 0, 0.5)`
- Modals and dialogs: `0 0 0 1px rgba(255, 255, 255, 0.12), 0 16px 70px rgba(0, 0, 0, 0.65)`

Tooltips take the lightest of these. Pair each elevation with the matching radius below.

## Motion

Use motion only when it clarifies a change, never for decoration. Most interactions should feel instant: a duration of `0ms` is often the snappiest and best choice, and the call is context-dependent. When motion genuinely helps, such as revealing or moving an element, keep it short and physical with the easing `cubic-bezier(0.175, 0.885, 0.32, 1.1)`: roughly 150ms for state changes, 200ms for popovers and tooltips, and 300ms for overlays and modals. Avoid long, looping, or attention-grabbing animation, and honor `prefers-reduced-motion` by dropping nonessential motion.

## Shapes

Radii stay tight: 6px for everyday surfaces and controls, 12px for menus and modals, 16px for fullscreen surfaces. Reserve 9999px for pills, avatars, and circular controls. Keep one radius family per view rather than mixing rounded and sharp corners.

## Components

The `components` tokens above give ready-to-use values per element (`backgroundColor`, `textColor`, `rounded`, `height`) drawn from this theme:

- Primary button: solid `gray-1000` fill with a `background-100` label, for the single most important action on a view.
- Secondary button: `background-100` fill with a translucent `gray-alpha-400` border.
- Tertiary button: transparent fill with `gray-1000` text for low-emphasis actions; it tints with `gray-alpha` on hover.
- Error button: solid `red-800` fill with white text, for destructive actions.
- Input: `background-100` fill, translucent border, 6px radius.

The variant tokens are the default medium (40px) size. Use the `button-small`/`input-small` (32px) and `button-large`/`input-large` (48px) tokens for the other sizes; large buttons step up to `button-16`. Hover and active states step up the scale: a `100` fill becomes `200` on hover and `300` on active, and borders move from `400` to `500` to `600`. Disabled uses a `gray-100` fill, `gray-700` text, and a not-allowed cursor. Focus shows a two-layer ring (`box-shadow: 0 0 0 2px #0a0a0a, 0 0 0 4px #0070f3`): a 2px gap in the surface color, then a 2px `blue-700` ring.

## Voice & Content

Copy is part of the design; keep it precise and free of filler.

- Use Title Case for labels, buttons, titles, and tabs; sentence case for body, helper text, and toasts.
- Name actions with a verb and a noun (`Deploy Project`, `Delete Member`), never `Confirm`, `OK`, or a bare verb.
- Write errors as what happened plus what to do next: `Build failed. Bundle exceeds 50 MB. Reduce it or raise the limit.`
- Toasts name the specific thing that changed, drop the trailing period, and never say `successfully`: `Project deleted`, not `Successfully deleted the project.`
- Empty states point to the first action: `No deployments yet. Push to your Git repository to create one.`
- Use the present participle with an ellipsis for in-progress states: `Deploying…`, `Saving…`.
- Use numerals (`3 projects`), curly quotes, and the ellipsis character; skip `please` and marketing superlatives.

## Do's and Don'ts

- Use the gray scale to rank information: `1000` for primary text, `900` for secondary, `700` for disabled.
- Keep solid accent color for state and the single most important action on a view.
- Hold WCAG AA contrast (4.5:1 for body text).
- Show the focus ring on every interactive element at `:focus-visible`, and never remove an outline without a visible replacement.
- Apply the typography tokens instead of setting font size, line height, or weight by hand.
- Don't signal state with color alone; pair it with an icon or text label.
- Don't use `background-200` as a general fill; it is for subtle separation only.
- Don't mix rounded and sharp corners, or more than two font weights, in one view.
- Don't swap `gray-*` for `background-*`; they are separate scales.

## Card Vault mapping

This app applies Geist Dark to the shell (page, forms, dialogs, buttons). Physical wallet cards use elevated matte dark surfaces on `background-200`, matching real payment cards in a dark wallet UI.
