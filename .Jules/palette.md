## 2025-05-14 - Global Keyboard Accessibility
**Learning:** Broadly applying `outline-none` in CSS is a significant accessibility regression. It's better to replace it with a high-contrast `focus-visible` ring that matches the brand's aesthetic.
**Action:** Use `*:focus-visible` with a 2px indigo outline and offset in global CSS to maintain both accessibility and a premium SaaS look.

## 2025-05-14 - Skip to Content Pattern
**Learning:** A "Skip to content" link is a critical micro-UX for keyboard users, allowing them to bypass repetitive navigation. It should be visually hidden but appear at the top of the viewport when focused.
**Action:** Implement the `.ushqn-skip-link` pattern across all major layouts (`AppLayout`, `AuthShell`), targeting the primary content container.
