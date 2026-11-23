# StudyBridge university database

## Files
- `universities.json`: normalized seed directory migrated from the original website's university list.
- `degree-levels.json`: supported undergraduate and postgraduate search categories.
- `scholarships.json`: verified scholarship and funding opportunity directory (currently an empty, ready-to-populate dataset).

## Record rules
- Each institution has a stable `id`.
- StudyBridge supports both `undergraduate` and `postgraduate` discovery. Each university's `degree_levels` remains empty until its official programme catalogue is checked; do not infer availability from the institution name.
- `official_website` is the institution's homepage URL carried over from the existing site; verify it before marking the record reviewed.
- `tuition.amount` must remain `null` until an official source confirms the amount for the relevant programme, degree level, international-student category, currency, and academic year.
- `legacy_estimate_eur` preserves the old site's approximate EUR figure for audit only. It is not verified and must not be treated as current tuition.
- `record_status` values: `needs_review`, `reviewed`, `published`, `archived`.
- `tuition.verification_status` values: `not_verified`, `official_source_verified`, `expired`.
- `last_verified` uses ISO date format (YYYY-MM-DD) and remains null until a human/source review is completed.

## Scholarship record requirements
Each scholarship record must include a stable ID, official title, provider, eligible countries/nationalities, eligible study levels, eligible programmes or fields (if restricted), funding type and amount (with currency and coverage), application deadline or cycle, official application URL, official source URL, date checked, and verification status. If a field is not stated by the official provider, mark it unknown rather than guessing. Recheck deadlines and eligibility for every cycle.

## Required tuition evidence before publication
1. Official institution fee page or official programme fee schedule.
2. Programme and degree level.
3. International-student fee category.
4. Currency and fee basis (per year, semester, credit, or full programme).
5. Academic year or intake period.
6. Direct source URL and date checked.

## Current status
The initial migration contains 30 records from the legacy website. They are intentionally marked `needs_review`; this migration does not certify fees or admission information. The existing live UI is unchanged in this milestone.
