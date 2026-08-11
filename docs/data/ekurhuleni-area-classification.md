# Ekurhuleni Included-Area Classification

Date: 2026-08-10
Status: Working classification

## Purpose

Karta distinguishes between:

- all City of Ekurhuleni Census 2011 sub-places used for citywide comparison; and
- a current inclusion set of township and historically marginalised settlement areas highlighted with dissolved outlines.

Stats SA does not publish a `township` boundary type in this dataset. The inclusion set is therefore a project classification, not an official or exhaustive list of Ekurhuleni townships. It follows the same methodology as `docs/data/tshwane-area-classification.md` and `docs/data/johannesburg-area-classification.md`.

## Selection rules

Each included area is defined in `packages/app/src/constants/townships.ts` using one of two reproducible rules:

1. `census-main-place`: include sub-places whose Census code begins with one or more specified main-place codes.
2. `named-sub-places`: include only sub-places matching specified name prefixes where the Census main place is mixed and cannot safely be included wholesale.

Ekurhuleni's municipality code (`MN_CODE`) in the Stats SA Census 2011 sub-place shapefile is 797. Unlike every other metro's inclusion set, Ekurhuleni's uses `named-sub-places` exclusively: its main places are broad and mixed (e.g. combining a formal township with surrounding industrial or agricultural-holding sub-places under one main-place code), so a per-area `subPlaceNamePrefixes` match was judged the safer default throughout, rather than the `census-main-place` shortcut used where a metro's main place already lines up cleanly with one township (as in most of Tshwane and Emfuleni).

## Current inclusion set

The current version includes 31 areas:

- Tembisa
- Katlehong
- Thokoza
- Vosloorus
- Daveyton
- Wattville
- KwaThema
- Duduza
- Tsakane
- Etwatwa
- Zonkizizwe
- Langaville
- Actonville
- Reiger Park
- Chief Albert Luthuli Park
- Clayville
- Primrose
- Joe Slovo
- Ulana Park
- Hlahane
- Driefontein
- Bapsfontein
- Breswol
- Dukathole
- Geluksdal
- Harry Gwala
- Holfontein
- Kanana
- Lindelani Village
- Thinasonke
- Tweefontein

Tembisa, Katlehong, Thokoza, Vosloorus, Daveyton, Wattville, KwaThema, Duduza, Tsakane, and Etwatwa are the primary anchors: the largest and most historically documented apartheid-era townships on the East Rand. The remainder are smaller townships and long-established informal settlements tied to the same displacement geography.

## Corrections made during the 2026-08-10 audit

A cross-check of every defined area's `subPlaceNamePrefixes`/`censusMainPlaceCodes` against the real Census 2011 sub-place names in the published `packages/web/public/data/gauteng/*.geojson` output found that 10 areas across the domain matched zero sub-places — meaning `data-pipeline/src/townshipAreas.ts` silently dropped them from the map, since it treats a zero-match area exactly like a genuinely-excluded one. `data-pipeline/src/townshipAreas.ts`'s `assertNoUnmatchedTownshipAreas` (wired into `run.ts`) now fails the pipeline loudly on any future zero-match area, so this can't recur silently.

Three of the ten were fixable name mismatches, corrected in place:

- `kwathema`'s `subPlaceNamePrefixes` was `"KwaThema"`; the actual Census sub-place names are hyphenated (`Kwa-Thema CBD`, `Kwa-Thema Ext 6`, etc.). Fixed to `"Kwa-Thema"`. The display `name` stays `"KwaThema"`, the commonly used unhyphenated spelling.
- `chief-albert-luthuli-park`'s prefix was `"Chief Albert Luthuli Park"`; the actual sub-place names abbreviate to `"Chief A Luthuli Park"` (`SP`/`X1`/`X4`). Fixed accordingly; the display name keeps "Albert" in full.
- `ulana-park`'s prefix was `"Ulana Park"`; the actual Census 2011 sub-place is named just `"Ulana"` (no "Park" suffix). Fixed accordingly; the display name keeps "Ulana Park", the name used in municipal housing-project documentation for the same community.

One was a genuine data error rather than an Ekurhuleni issue: Midvaal's `midvaal-evaton` area (`docs/data/midvaal-area-classification.md`) had `censusMainPlaceCodes: ["761009"]`, which is actually the main place named "Lakeside" — an unrelated place. Midvaal's small Evaton-area main place is `761008`. Corrected there.

Six were removed rather than force-matched, after confirming each is a real, documented Ekurhuleni community with no corresponding Census 2011 sub-place boundary under any name checked in the published shapefile mirror — the same situation as Tshwane's already-documented Itumeleng exclusion:

- **Makause** — a well-documented informal settlement in Primrose, Germiston, established in the mid-1990s on the former Driefontein Farm.
- **Kalamazoo** — an informal settlement in Boksburg, one of the communities named in the City of Ekurhuleni's Leeuwpoort Mega Human Settlement relocation project.
- **Skoon Plaas** (Skoonplaas) — an informal settlement near Tsakane, settled since 1974.
- **Crossroads** (also documented as "Roodekop Ext 3") — another Leeuwpoort project beneficiary community; a main place named bare "Roodekop" exists in the Census 2011 data, but nothing corresponding to the "Ext 3"/informal "Crossroads" portion could be confirmed, so it was left out rather than mislabelling the older "Roodekop" main place as "Crossroads".
- **Duduza North** — no Census 2011 sub-place starting with "Duduza North" was found; Duduza's own main place (already included as `duduza`) covers only two sub-places (`Duduza`, `Duduza SP`) in this data source.
- **Emandleni** — a well-documented informal settlement on the Wattville/Actonville border, subject to a City of Ekurhuleni reblocking programme from 2017; no matching Census 2011 sub-place name was found nearby.

## Limitations

Inclusion does not establish a legal apartheid-era classification, a date of proclamation, demographic composition, or uniform settlement history. Main-place/sub-place membership is a practical spatial grouping, not historical proof. The six communities listed above are real, still remain outside the current set, and should be added once a finer or newer boundary source (such as a scriptable Census 2022 Small Area Layer export, if one becomes publicly available — see `docs/data/tshwane-area-classification.md`'s "Why Census 2011, not Census 2022" section) delineates them separately.

The classification should be extended only when an area has:

- a stable Census code or explicit sub-place selector;
- a documented reason for inclusion;
- a check for mixed land uses and non-residential anomalies; and
- a review of how its label and boundary behave at desktop and mobile scales.

Future archival work should add dated proclamation or forced-removal geographies as separate evidence layers rather than silently treating this working classification as historical fact.
