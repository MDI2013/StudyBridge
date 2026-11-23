# StudyBridge university database

## Files
- `universities.json`: normalized seed directory migrated from the original website's university list.
- `degree-levels.json`: supported undergraduate and postgraduate search categories.
- `scholarships.json`: scholarship and funding opportunity directory. It is currently empty until official opportunities are researched and verified.

## University record rules
- Each institution has a stable `id`.
- StudyBridge supports both `undergraduate` and `postgraduate` discovery. Each university's `degree_levels` remains empty until its official programme catalogue is checked; do not infer availability from the institution name.
- `official_website` is the institution's homepage URL carried over from the existing site; verify it before marking the record reviewed.
- `tuition.amount` must remain `null` until an official source confirms the amount for the relevant programme, degree level, international-student category, currency, and academic year.
- `legacy_estimate_eur` preserves the old site's approximate EUR figure for audit only. It is not verified and must not be treated as current tuition.
- `record_status` values: `needs_review`, `reviewed`, `published`, `archived`.
- `tuition.verification_status` values: `not_verified`, `official_source_verified`, `expired`.
- `last_verified` uses ISO date format (YYYY-MM-DD) and remains null until a human/source review is completed.

## Scholarship record requirements
Each scholarship record must include a stable ID, official title, provider, nationality and residence eligibility, host/destination country, eligible study levels, eligible programmes or fields (if restricted), funding type and amount (with currency and coverage), deadline or application cycle, official application URL, official source URL, date checked, and verification status.

### Nationality-based discovery
- Students should be able to filter opportunities by one or more nationalities, independently of their current country of residence. These are different eligibility dimensions and must not be conflated.
- Store each nationality separately using ISO 3166-1 alpha-3 country codes. Use `ALL` only when the official provider explicitly confirms all nationalities are eligible.
- Keep `eligible_nationalities`, `excluded_nationalities`, and `eligible_residencies` separate. Do not infer eligibility from a scholarship's host country, university, or application location.
- For a student with multiple nationalities, assess each nationality against the provider's official rules and any provider-defined nationality groups. A match on one nationality is not automatically sufficient if the provider restricts dual/multiple citizens or imposes additional nationality conditions.
- If dual/multiple-citizenship rules are unclear, show eligibility as unknown and link to the official source rather than promising eligibility.
- Support destination country, study level, field of study, and funding type as additional discovery filters.
- Matching statuses should be clear: eligible only when the official source confirms the student's conditions; not eligible only when the source clearly excludes them; otherwise show eligibility as unknown / not yet verified.
- Track application-cycle availability separately from eligibility verification with `application_status`: `open`, `upcoming`, `closed`, `not_announced`, `varies`, or `unknown`. A verified eligibility source does not mean applications are currently open.
- The scholarship discovery page provides a global nationality and residence picker, supports multiple selected nationalities, remembers nationality selections in the browser, and filters destinations, study levels, application-cycle status, and records needing review.
- If the provider does not state a condition, preserve it as unknown. Never treat missing data as unrestricted eligibility.
- Recheck eligibility, award coverage, and deadlines for every application cycle. Mark expired or closed opportunities accordingly.
- Never describe an award as fully funded unless the official provider confirms the full coverage.

The detailed machine-readable field definitions and matching policy are in `scholarships.json`.

### Local validation
Run `node scripts/validate-scholarships.js` from the repository root to check required fields, unique IDs, verification/application status values, country-code formats, study-level values, date formats, and HTTPS source/application links. The script uses only Node.js built-ins.

## Required tuition evidence before publication
1. Official institution fee page or official programme fee schedule.
2. Programme and degree level.
3. International-student fee category.
4. Currency and fee basis (per year, semester, credit, or full programme).
5. Academic year or intake period.
6. Direct source URL and date checked.

## Current status
The initial migration contains 30 university records. They are intentionally marked `needs_review`; this migration does not certify fees or admission information. The scholarship dataset currently contains eleven researched records: four verified opportunities, four closed cycles retained for reference, and three opportunities requiring further verification. Each record also has an explicit application-cycle status so users can distinguish open, upcoming, closed, not-yet-announced, and variable-deadline opportunities. These records cover all ten initial target countries: France, Canada, Germany, the United Kingdom, the United States, Morocco, Spain, the Netherlands, Australia and Japan. The dedicated `scholarships.html` page loads this JSON dataset and provides multi-nationality, residence, destination, study-level and status filters. The main navigation links to the scholarship page. These changes remain on the development branch until merged into `main` and deployed.
