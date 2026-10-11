# Design system

## Creative direction

“Your story begins here. Our world is written together.” Official fantasy branding supplies the spectacle; quiet editorial layouts give real community screenshots room to breathe. The homepage moves from arrival to architecture, people, memories, progression, and a joining guide. Player groups are contained rather than cropped in galleries. Archived imagery is never presented as a current map or event announcement.

## Tokens

| Token     | Exact value | Use                                                  |
| --------- | ----------- | ---------------------------------------------------- |
| abyss     | #00076F     | Deep-blue hero and ambient layers                    |
| violet    | #44008B     | Restrained section lighting and notices              |
| orchid    | #9F45B0     | Decorative orbit/borders; not small text on ink      |
| pink      | #E54ED0     | CTA background, focus, selected controls, highlights |
| blush     | #FFE4F2     | Primary text and starlight                           |
| ink       | #080919     | Main background and CTA text                         |
| surface   | #111225     | Dialogs, connection and verification panels          |
| surface-2 | #17172F     | Secondary/hover surfaces                             |
| muted     | #B8B4CD     | Supporting text                                      |

CSS tokens live in src/app/globals.css. Colors are measured with WCAG relative-luminance calculation in src/lib/validation.mjs, not assumed accessible because they are official.

| Foreground / background |          Contrast ratio |
| ----------------------- | ----------------------: |
| Blush / ink             |                 16.58:1 |
| Muted / ink             |                  9.82:1 |
| Blush / surface         |                 15.51:1 |
| Muted / surface-2       |                  8.71:1 |
| Pink / ink              |                  5.95:1 |
| Ink / pink CTA          |                  5.95:1 |
| Blush / violet          |                 10.89:1 |
| Blush / abyss           |                 13.99:1 |
| Orchid / ink            | 3.72:1, decorative only |

Ratios are rounded and unit-tested. Text-over-image readability also depends on gradients and the actual scene; token contrast is not a whole-site WCAG certification.

## Type, space, and media

Space Grotesk Variable is the display face and Inter Variable the body face. Fonts are bundled locally through Fontsource; no Google Fonts request is made. Desktop hero type reaches 124px with fluid mobile sizing; body text is typically 14–16px. Eyebrows are restrained uppercase markers, never the sole explanation of a control.

The maximum content width is 1320px. Margins step from 56px to 32px to 20px. Header height is 88px desktop and 76px on small phones; the official 1100×449 wordmark remains proportional. Portrait editorial scenes alternate with wide contained groups, staggered memory thumbnails, and typographic feature columns. Native scroll areas are limited to the rank tab row and narrow cookie table.

The source image dimensions and focal points come from src/data/gallery.ts. Screenshot derivatives are 640, 1280, and 1920px where the original permits. 1366px originals have no 1920px derivative. The lightbox loads the largest available file on demand. The homepage hero alone is preloaded; other scenes are lazy-loaded. All media reserves aspect-ratio space.

## Interaction and accessibility

Native details provide tap/keyboard navigation and FAQ disclosure. Native dialog supplies modal focus containment, Escape dismissal, and background inertness; the trigger regains focus on close. The mobile sheet exposes all navigation groups. Gallery categories use pressed buttons; search and result counts are labeled/live. Gallery keyboard arrows, buttons, and a horizontal touch-swipe threshold change images. Group photos use contain.

Java/Bedrock and rank controls follow tab semantics with arrow, Home, End navigation, a selected tab, and a labeled panel. Copy feedback appears only after the Clipboard promise succeeds; denied access shows a manual-copy instruction. Visible addresses are selectable. Focus uses a two-pixel pink outline with offset. A skip link reaches the semantic main element. Public pages have one H1 and a clear heading structure.

## Motion

Actions transition in 180ms. Below-fold reveals use a 24px transform and a single 600ms fade after JavaScript initialization; initial above-fold text remains visible. CSS view-timeline imagery zooms from 1.00 to 1.04 on supported desktop browsers. No scroll lock, pointer wobble, long intro loader, or pinned sequence is used.

Reduced motion disables animations, transforms, transitions, and smooth scrolling. Reveals restore visible content when the preference changes, on route cleanup, and when IntersectionObserver is unavailable. Small screens use simpler compositions. WCAG 2.2 AA is a design target; assistive-technology and real-device evaluation remain part of launch review.
