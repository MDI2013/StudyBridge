# StudyBridge release-readiness checklist

Last reviewed: 2026-11-25
Branch: `feature/university-database-v1`

## Automated checks

Latest recorded GitHub Actions run before this checklist update:
- Workflow: Validate StudyBridge data
- Run: 45320527510
- Result: success
- Completed steps:
  - Scholarship data validation
  - Programme data validation
  - University data validation
  - Page scripts and local-link validation
  - Matching logic tests

This confirms the repository's automated structural checks passed for the commit tested by that run. It does not establish browser-level or mobile end-to-end correctness.

## Current data readiness

- Universities: 36 records; all 36 are marked `needs_review`.
- University tuition: all 36 records are marked `not_verified`; do not present legacy estimates as current verified fees.
- Programmes: 5 records; unknown fee, language, and admission details must remain unknown until confirmed from official sources.
- Scholarships: 20 records — 9 verified, 7 needs_review, 4 closed.
- Scholarship application-cycle status is separate from eligibility verification. Recheck deadlines and award terms against official sources for each cycle.

## Manual browser QA — not yet completed

### Shared navigation
- [ ] Test every navigation link on all pages.
- [ ] Confirm mobile hamburger opens on the first tap.
- [ ] Confirm it closes after selecting a page, tapping outside, and pressing Escape where supported.
- [ ] Confirm hamburger position is consistent across pages.
- [ ] Confirm back-to-top button is consistent and does not cover important controls.

### Country Guide and globe
- [ ] Confirm the 3D globe loads on desktop and iOS Safari.
- [ ] Confirm drag/touch rotation and auto-rotation work without blocking page scrolling.
- [ ] Confirm all destination markers are clickable and select the matching country.
- [ ] Confirm the globe and selected-destination text are not clipped at narrow widths.
- [ ] Confirm a useful country-list fallback appears if the external globe library or Earth texture cannot load.

### Discovery pages
- [ ] Test university search, filters, empty states, and result cards.
- [ ] Test programme search, filters, match explanations, and add-to-tracker.
- [ ] Test scholarship nationality/residence/destination/level/status filters.
- [ ] Test unknown and dual-nationality cases to ensure no unsupported eligibility promise is made.

### Saved work and privacy
- [ ] Test shortlist add/remove and comparison.
- [ ] Test profile save/reload and clear behaviour.
- [ ] Test tracker create/edit/delete and JSON export/import.
- [ ] Confirm privacy notices explain browser-local storage and no cloud sync.
- [ ] Confirm no sensitive identity or document data is requested.

### Responsive and accessibility
- [ ] Test representative iPhone and Android viewport sizes.
- [ ] Test tablet and desktop layouts.
- [ ] Check keyboard focus, visible focus states, labels, contrast, and reduced-motion behaviour.
- [ ] Check browser console for JavaScript errors and failed network requests.

## Release gates

- [ ] Resolve all critical and high-priority manual QA findings.
- [ ] Re-verify published university, programme, and scholarship facts against official sources.
- [ ] Confirm external dependencies have a reliable fallback or are self-hosted.
- [ ] Review privacy, accessibility, and performance.
- [ ] Obtain explicit owner approval before merging to `main` or deploying to the original live website.

## Safety rule

The development branch and isolated preview may be updated during testing. Do not merge to `main` or deploy to the original production website without explicit approval.
