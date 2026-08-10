# Midvaal Included-Area Classification

Date: 2026-07-31
Status: Working classification

## Purpose

Karta distinguishes between:

- all Midvaal Census 2011 sub-places used for municipality-wide comparison; and
- a current inclusion set of township and historically marginalised settlement areas highlighted with dissolved outlines.

Stats SA does not publish a `township` boundary type in this dataset. The inclusion set is therefore a project classification, not an official or exhaustive list of Midvaal townships.

## Selection rules

Each included area is defined in `packages/app/src/constants/townships.ts` using one of two reproducible rules:

1. `census-main-place`: include sub-places whose Census code begins with one or more specified main-place codes.
2. `named-sub-places`: include only sub-places matching specified name prefixes where the Census main place is mixed and cannot safely be included wholesale.

Midvaal's municipality code (`MN_CODE`) in the Stats SA Census 2011 sub-place shapefile is 761 (`MN_MDB_C` GT422).

## Current inclusion set

The current version includes 2 areas:

- Mamello
- Evaton (Midvaal segment)

Evaton's small Midvaal-side main place is Census code `761008` (area 1.42 km², population 9,234 at Census 2011) — a distinct enclave from the much larger Evaton main place (`760002`) that falls under Emfuleni, documented in `docs/data/emfuleni-area-classification.md`. A 2026-08-10 audit found the code previously recorded here, `761009`, was actually the main place named "Lakeside", an unrelated area — `midvaal-evaton` matched zero sub-places and was silently absent from the published map until corrected. The Census 2011 sub-place found under the corrected `761008` code is itself named `"Nooitgecht AH"` rather than "Evaton"; main-place and sub-place names can differ, and matching is by code, not name, for `census-main-place` areas.

## Limitations

Inclusion does not establish a legal apartheid-era classification, a date of proclamation, demographic composition, or uniform settlement history. Main-place membership is a practical spatial grouping, not historical proof.

Future historical work should add dated proclamation or forced-removal geographies as separate evidence layers rather than silently treating this working classification as historical fact.
