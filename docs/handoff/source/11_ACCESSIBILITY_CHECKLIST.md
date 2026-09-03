# Accessibility, RTL and Inclusive Interaction Checklist

**Version:** 0.1  
**Date:** 01.09.2026  
**Status:** Review  
**Owner:** Design + Engineering + QA  
**Target:** WCAG 2.2 AA where applicable

## 1. Release rule

Accessibility settings are product capabilities, not cosmetic rewards. No setting may change score, available content, progress or rewards.

Every checklist item marked `MUST` must pass at 360px mobile, keyboard-only, muted audio and reduced-motion configurations.

## 2. Hebrew and RTL

| ID | Requirement | Level |
|---|---|---|
| A11Y-RTL-01 | Set document language to Hebrew and root direction to RTL | MUST |
| A11Y-RTL-02 | Reading, visual and keyboard order are logical in RTL | MUST |
| A11Y-RTL-03 | Mirror directional icons only when their meaning is directional | MUST |
| A11Y-RTL-04 | Protect numbers, percentages, IDs and Latin keys with correct bidi handling | MUST |
| A11Y-RTL-05 | Do not center-align multi-line instructional text | MUST |
| A11Y-RTL-06 | No clipped Hebrew diacritics/glyphs or reversed punctuation | MUST |
| A11Y-RTL-07 | Test mixed strings such as `קרב 23`, `4 / 5`, `80%` and outcome IDs | MUST |

## 3. Responsive layout

| ID | Requirement | Level |
|---|---|---|
| A11Y-RES-01 | Full journey works at CSS width 360px without horizontal scrolling | MUST |
| A11Y-RES-02 | Baseline 390px design does not hide controls when browser UI changes viewport height | MUST |
| A11Y-RES-03 | On-screen keyboard keeps the active field, counter and submit control reachable | MUST |
| A11Y-RES-04 | Text remains usable at 200% browser zoom | MUST |
| A11Y-RES-05 | Tablet/desktop layout preserves semantic reading order | MUST |
| A11Y-RES-06 | Sticky CTA never covers focused content, feedback or validation messages | MUST |

## 4. Typography and readability

| ID | Requirement | Level |
|---|---|---|
| A11Y-TXT-01 | Body text is at least 16px | MUST |
| A11Y-TXT-02 | Primary instructions are normally 18–20px | MUST |
| A11Y-TXT-03 | Body line height is at least 1.4 | MUST |
| A11Y-TXT-04 | One primary instruction is normally no more than 12 words | SHOULD |
| A11Y-TXT-05 | Feedback is no more than two short sentences | SHOULD |
| A11Y-TXT-06 | At most one new technical term is introduced on one screen | MUST |
| A11Y-TXT-07 | “מה זה אומר?” opens definition + example without losing battle state | MUST |
| A11Y-TXT-08 | Critical instructions are always available as text | MUST |
| A11Y-TXT-09 | Copy evaluates the prompt, not the child | MUST |

## 5. Contrast and non-color communication

| ID | Requirement | Level |
|---|---|---|
| A11Y-COL-01 | Normal text contrast is at least 4.5:1 | MUST |
| A11Y-COL-02 | Large text and active component boundaries are at least 3:1 | MUST |
| A11Y-COL-03 | Focus indication meets 3:1 against adjacent colors | MUST |
| A11Y-COL-04 | Success, partial, safety, selected, locked and disabled states use text/icon/shape in addition to color | MUST |
| A11Y-COL-05 | Safety state is calm and not dependent on red | MUST |
| A11Y-COL-06 | Half stars have a numeric equivalent such as `4.5 / 5` | MUST |
| A11Y-COL-07 | Map locked/open/completed states remain distinguishable in grayscale | MUST |

## 6. Pointer, touch and controls

| ID | Requirement | Level |
|---|---|---|
| A11Y-INP-01 | Interactive target size is at least 44×44 CSS pixels | MUST |
| A11Y-INP-02 | Controls use native semantic elements where possible | MUST |
| A11Y-INP-03 | Drag-and-drop/sorting has a full click and keyboard alternative | MUST |
| A11Y-INP-04 | No essential action requires precise path drawing, multi-touch or device motion | MUST |
| A11Y-INP-05 | Accidental double activation cannot duplicate rewards or purchases | MUST |
| A11Y-INP-06 | Disabled controls expose why or remain absent; color alone is insufficient | MUST |

## 7. Keyboard

| ID | Requirement | Level |
|---|---|---|
| A11Y-KEY-01 | Every action is available with keyboard only | MUST |
| A11Y-KEY-02 | Tab order follows visible RTL task flow | MUST |
| A11Y-KEY-03 | Focus is always visible and distinct from selection | MUST |
| A11Y-KEY-04 | No keyboard trap in modal, workshop, help sheet or battle builder | MUST |
| A11Y-KEY-05 | Escape/close behavior is predictable and does not discard progress silently | MUST |
| A11Y-KEY-06 | On state transition, focus moves to the new heading/status, not page top arbitrarily | MUST |
| A11Y-KEY-07 | Component reordering exposes move-before/move-after controls and announces position | MUST |

## 8. Screen readers and dynamic status

| ID | Requirement | Level |
|---|---|---|
| A11Y-SR-01 | Every screen has one descriptive primary heading | MUST |
| A11Y-SR-02 | Buttons and icon controls have unique accessible names | MUST |
| A11Y-SR-03 | Images conveying outcome meaning have concise alternatives; decorative images are ignored | MUST |
| A11Y-SR-04 | Validation messages are programmatically associated with their field/control | MUST |
| A11Y-SR-05 | New result/feedback is announced once without repeating full scenery | MUST |
| A11Y-SR-06 | Loading status is announced politely and has bounded completion/error | MUST |
| A11Y-SR-07 | Star score, map progress and wallet expose textual values | MUST |
| A11Y-SR-08 | Locked prompt components expose locked reason and retained correctness | MUST |

## 9. Motion and animation

| ID | Requirement | Level |
|---|---|---|
| A11Y-MOT-01 | No flashing or rapid brightness change | MUST |
| A11Y-MOT-02 | One primary animation runs at a time | MUST |
| A11Y-MOT-03 | Outcome animations last about 2–4 seconds | SHOULD |
| A11Y-MOT-04 | Repeated outcome animations shorten or can be skipped | MUST |
| A11Y-MOT-05 | Respect `prefers-reduced-motion` on first run | MUST |
| A11Y-MOT-06 | Reduced motion uses static state or gentle opacity transition | MUST |
| A11Y-MOT-07 | Reduced motion preserves all feedback, causality, score and progression | MUST |
| A11Y-MOT-08 | No required information disappears before it can be read | MUST |

## 10. Audio

| ID | Requirement | Level |
|---|---|---|
| A11Y-AUD-01 | Separate music and effects toggles | MUST |
| A11Y-AUD-02 | Entire journey completes with sound muted | MUST |
| A11Y-AUD-03 | Every sound cue has a visual/text equivalent | MUST |
| A11Y-AUD-04 | Audio does not autoplay loudly before meaningful user interaction | MUST |
| A11Y-AUD-05 | Setting changes take effect immediately and persist locally | MUST |
| A11Y-AUD-06 | Safety/error sound is soft and non-alarming | MUST |

## 11. Cognitive accessibility

| ID | Requirement | Level |
|---|---|---|
| A11Y-COG-01 | One primary task and one primary CTA per step | MUST |
| A11Y-COG-02 | Correct components remain visible across retries | MUST |
| A11Y-COG-03 | Feedback identifies one actionable missing component at a time | MUST |
| A11Y-COG-04 | Guided completion guarantees continuation | MUST |
| A11Y-COG-05 | Technical errors provide clear retry/fallback/map actions | MUST |
| A11Y-COG-06 | No countdown or speed pressure | MUST |
| A11Y-COG-07 | Time, retry and hint use do not automatically reduce score | MUST |
| A11Y-COG-08 | Safety stop provides a positive safe correction | MUST |

## 12. Battle 23

| ID | Requirement | Level |
|---|---|---|
| A11Y-B23-01 | Text area has persistent label, privacy reminder and 600-character counter | MUST |
| A11Y-B23-02 | Counter is not announced on every keystroke; warning is announced near limit | MUST |
| A11Y-B23-03 | Local block identifies the correction category without exposing/logging matched personal text | MUST |
| A11Y-B23-04 | Static outline/heading replaces flashing emphasis | MUST |
| A11Y-B23-05 | Half-open builder works by keyboard and screen reader | MUST |
| A11Y-B23-06 | Technical failure message does not falsely claim persistence | MUST |
| A11Y-B23-07 | Refresh behavior and draft deletion are explained before leaving where necessary | SHOULD |

## 13. Manual verification matrix

Test at minimum:

- iPhone-class 360–390px viewport with Safari behavior emulation;
- Android-class 360–412px viewport;
- tablet portrait and landscape;
- desktop at 1280px and 200% zoom;
- keyboard-only;
- VoiceOver or equivalent mobile screen reader;
- NVDA or equivalent desktop screen reader;
- muted system;
- reduced motion;
- grayscale/high-contrast inspection.

All failed `MUST` items block release.

