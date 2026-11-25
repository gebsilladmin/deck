---
name: AVA and MemorX investor presentations
description: Incumbent editorial presentation system and its product selector.
colors:
  ink: "#151716"
  paper: "#f4f1e8"
  accent: "#384e40"
  sage: "#8f9e91"
  muted: "#5e665f"
  line: "#cdd1c7"
  soft: "#e3e9df"
  memorx-accent: "#164d50"
  memorx-sage: "#db652f"
  memorx-muted: "#4f6563"
  memorx-line: "#c3cfca"
  memorx-soft: "#e0e8e3"
  white: "white"
typography:
  display:
    fontFamily: "Playfair, Georgia, serif"
    fontSize: "clamp(42px, 4.5vw, 68px)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-.03em"
  headline:
    fontFamily: "Playfair, Georgia, serif"
    fontSize: "clamp(40px, 4.4vw, 70px)"
    fontWeight: 500
    lineHeight: 1.07
    letterSpacing: "-.035em"
  body:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.4
  fine:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "14px"
rounded:
  panel: "16px"
  primary: "40px"
  pill: "30px"
spacing:
  compact: "8px"
  control: "16px"
  standard: "24px"
  section: "32px"
components:
  choice-ava:
    textColor: "{colors.accent}"
    padding: "38px 4.5vw 34px 0"
  choice-memorx:
    textColor: "{colors.memorx-accent}"
    padding: "38px 0 34px 4.5vw"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    rounded: "{rounded.primary}"
    padding: "16px 22px"
  button-text:
    padding: "7px 0"
  pill:
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  settings-toggle:
    backgroundColor: "{colors.paper}"
    width: "46px"
    height: "46px"
---

# Design System: AVA and MemorX investor presentations

## Overview

**Creative North Star: "Incumbent editorial investor presentations"**

This records the shipped identity, rather than proposing a new one. Warm ivory, near-black ink, spacious serif headings and clear sans-serif reading text establish the shared presentation frame. AVA forest and MemorX teal distinguish product actions without competing with the supplied logos.

The selector extends the deck's editorial rules into flat, equal navigation surfaces. The presentations also use rounded controls, contained media and occasional soft shadows; those treatments remain specific to their components. This record covers the selector and the shared deck vocabulary it inherits, not every slide-specific composition. Source authority is `public/styles.css`, `public/index.html` and `public/app.js`; desktop, mobile and 1280px review captures confirm the selector's rendered form. Product commitments remain in `PRODUCT.md`, and entry-state behavior remains in `.impeccable/surfaces/product-selector.md`.

**Key Characteristics:**
- Shared ivory canvas and ink typography.
- Product-specific forest and teal actions.
- Supplied logos, preserved as image assets.
- Serif hierarchy paired with readable sans-serif text.
- Flat editorial rules for navigation; restrained depth for deck media and overlays.

## Colors

The palette combines a warm neutral foundation with muted green and teal product accents. Frontmatter preserves the source CSS values; the source names `accent`, `sage`, `muted`, `line` and `soft` are AVA defaults.

### Primary
- **AVA forest — accent:** default product actions, selected controls and focus outlines.
- **MemorX teal — memorx-accent:** MemorX actions and its local selector action; entering its deck replaces the shared accent variable.

### Secondary
- **Sage — sage:** supporting AVA graphics and scrollbar treatment.
- **MemorX orange — memorx-sage:** supporting MemorX markers and graphics; also present in its supplied logo. It is not a selector button fill.

### Neutral
- **Ivory — paper:** shared page canvas and overlay surfaces.
- **Near-black — ink:** principal text and dark presentation areas.
- **Muted green-gray — muted / memorx-muted:** secondary reading text, notes and descriptions.
- **Rule gray-green — line / memorx-line:** dividers and control boundaries.
- **Soft green — soft / memorx-soft:** supportive fills and menu hover states.
- **White — white:** primary action text, media surrounds and chat surfaces.

### Named Rules
**The Product Accent Rule.** Match action color to the product context. MemorX's selector link changes its local accent while the shared selector canvas and descriptive text retain the default neutral palette.

## Typography

**Display Font:** Playfair, with Georgia and serif fallbacks. The source registers the supplied `Playfair.woff2` under the family name `Playfair`.

**Body Font:** Figtree, with Arial and sans-serif fallbacks, loaded from the supplied `Figtree.woff2`.

**Character:** Serif headings provide the editorial hierarchy. Sans-serif descriptions, actions and controls keep the operational text direct. Logos remain supplied artwork rather than font recreations.

### Hierarchy
- **Display:** selector heading uses the frontmatter display role; on mobile it resolves to (42px), with a (12ch) maximum width.
- **Headline:** inherited deck headings use the frontmatter headline role; section introductions use a smaller fluid range (`clamp(34px, 3.4vw, 55px)`). Deck hero headings have their own larger fluid range.
- **Body:** selector introduction and descriptions use the body role. The introduction is capped at (55ch), descriptions at (34ch). At mobile widths the introduction becomes (17px), descriptions (16px), with caps of (32ch) and (35ch).
- **Label:** entry actions use the label role; mobile actions become (17px). Header identity uses regular Figtree at (17px), becoming (16px) on mobile.
- **Fine:** the selector's secondary header and legal footer use the fine role; on mobile they become (12px) and (13px), respectively. Shared deck annotations commonly use the same fine size.

### Named Rules
**The Logo Integrity Rule.** Use the supplied AVA and MemorX image assets with contained fitting and their original proportions; do not rebuild their lettering as live text.

## Layout

The selector uses a centered flex column with a maximum width of (1700px), minimum height of (100dvh), desktop horizontal padding of (6.5vw), and top/bottom padding of (32px)/(24px). Its header aligns identity left and presentation context right. The introductory block has fluid top separation (`clamp(52px, 8vh, 90px)`) and bottom separation of (48px).

The product navigation is an equal two-column grid, bounded by one-pixel horizontal rules with a central vertical rule. Both links share a minimum height of (330px); their action rows align at the bottom. The internal horizontal inset is (4.5vw), placed to either side of the central divider. Descriptions follow logos, and actions follow descriptions. The legal footer uses automatic top margin and (38px) top padding.

At screen widths of (800px) or below, the page has (24px) outer padding and normal document scrolling. The product links stack, lose their minimum height and vertical divider, and receive (24px) vertical padding. A horizontal divider separates them. Intro separation becomes (42px) above and (32px) below. The footer's top padding becomes (28px). The selector does not inherit the deck's fixed-height scrolling stage.

The shared deck commonly uses two-column content grids and converts them to vertical flow at the same breakpoint. Repeated spacing steps in frontmatter describe observed rhythm; the selector's exact geometry remains component-specific. Print uses the implemented landscape deck treatment; the selector separately reduces its minimum heights and adjusts page insets.

## Elevation & Depth

The selector is flat: its links have no card fill, rounded silhouette or box shadow. Rules, whitespace and typography separate choices. The deck uses shadows on media containers and overlays; their presence is not a prescription to lift every surface.

### Shadow Vocabulary
- **Settings overlay** (`0 14px 45px #15171620`): anchors the menu over presentation content.
- **Dialog overlay** (`0 20px 70px #0003`): separates the evidence dialog from its dimmed, blurred backdrop.

### Named Rules
**The Ruled Navigation Rule.** Preserve the selector's flat shared canvas and thin dividers; apply the deck's overlay depth only to actual overlays.

## Shapes

Selector options are open rectangular regions with square corners and one-pixel rules. Logo images occupy contained boxes of (240px × 90px), becoming (185px × 61px) on mobile. Entry arrows are inline stroked SVGs, sized (26px) on desktop and (24px) on mobile.

Inherited presentation controls use round forms: primary actions use the primary radius token, pills use the pill radius token, and the settings toggle is circular. Panels such as menus and dialogs use the panel radius. These are component roles, not a universal card radius.

## Components

### Product choices

Each complete product region is one native link, named by its logo heading and described by its factual paragraph. Both choices share the same structural hierarchy. AVA uses the default accent; MemorX overrides its local accent. The action row is a label and SVG within the link, not a nested button.

Hover underlines the entry label and translates its arrow (6px) horizontally over (.3s) using the shared easing (`cubic-bezier(.16,1,.3,1)`). Keyboard focus uses the shared (3px) accent outline with a selector-specific offset of (7px). Reduced-motion preference disables animation and transitions. No custom active appearance is defined.

### Buttons

Primary deck buttons have accent fill, white text, semibold Figtree, generous horizontal padding and capsule corners. Hover uses `filter: brightness(1.12)`. Text buttons use a bottom rule, semibold text and no capsule fill. The shared focus treatment is an accent outline (3px), offset (5px). Disabled buttons use opacity (.32). Mobile primary buttons use (13px) type and (13px 18px) padding.

### Chips

The deck's working-MVP pill is an inline bordered status label with a small circular accent dot, compact internal spacing and a capsule outline. It is informational rather than a selectable filter.

### Inputs / Fields

The deck's observed form primitive is a native scenario range input, full-width with product accent color and vertical margin of (20px). It inherits the shared keyboard focus outline. There is no selector form or generic text-field system to extract.

### Navigation

The selector's navigation is the pair of product links. In the presentation, the supplied logo is a return link and a circular settings button exposes a bordered, softly shadowed menu. Menu rows have (12px 14px) padding, (16px) text and softly rounded corners (9px); hover uses the soft fill and current-product selection uses accent with white text. Settings toggles reduce from (46px) to (42px) at the mobile breakpoint. Menus support keyboard navigation and focus return in the shipped script.

### Cards / Containers

The selector's product regions follow Product choices, not a raised card treatment. Deck media and evidence containers retain their observed soft corners and component-specific shadows; no universal card API or generalized shadow scale is implied.

## Do's and Don'ts

### Do:
- **Do** retain the supplied fonts and original logo assets.
- **Do** match product actions to forest or teal through the Product Accent Rule.
- **Do** preserve equal structural prominence for the two selector links.
- **Do** keep native link semantics, visible keyboard focus and reduced-motion behavior.
- **Do** scope soft corners and depth to the deck components that use them.

### Don't:
- **Don't** turn selector options into raised, rounded cards.
- **Don't** recolor or retype the supplied logos.
- **Don't** nest buttons inside the product links.
- **Don't** use deck-only uppercase financing labels as a new heading tier on future surfaces.
