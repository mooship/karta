# Cape Town Included-Area Classification

Date: 2026-08-28
Status: Working classification

## Purpose

Karta distinguishes between:

- all City of Cape Town Census 2011 sub-places used for citywide comparison; and
- a current inclusion set of township and historically marginalised settlement areas highlighted with dissolved outlines.

Stats SA does not publish a `township` boundary type in this dataset. The inclusion set is therefore a project classification, not an official or exhaustive list of Cape Town townships.

## Why Census 2011, not Census 2022

See `docs/data/tshwane-area-classification.md`'s "Why Census 2011, not Census 2022" section — the same reasoning (no working, scriptable, license-compatible Census 2022 Small Area Layer boundary export was found) applies here; both metros are drawn from the same national `SP_SA_2011` shapefile mirror.

## Selection rules

Each included area is defined in `packages/app/src/constants/townships.ts` using one of two reproducible rules, the same two Tshwane/Johannesburg use:

1. `census-main-place`: include sub-places whose Census code begins with one or more specified main-place codes. Used for Langa, Nyanga, Gugulethu, Khayelitsha, Mitchells Plain, and Bishop Lavis — each has its own distinct Census main place.
2. `named-sub-places`: include only sub-places matching specified name prefixes where the Census main place is mixed and cannot safely be included wholesale. Used for Manenberg, Bonteheuwel, Heideveld, and Hanover Park, which are distinct sub-places within Census main place "Athlone" (main-place code 199028) — a broad Coloured group area under apartheid that also contains many sub-places (Rylands, Gatesville, Kewtown, and others) that are not part of this classification's inclusion set. Also used for Elsies River, matching only the "Elsies Rivier SP" sub-place under main place "Elsies Rivier" (code 199025); that main place's other sub-place, "Elsies River Industrial", is excluded (see below) since it is a separate, non-residential area, not part of the historic residential township.

Explicit exclusions remove known non-residential anomalies from otherwise useful Census groups. The current exclusion is Elsies River Industrial from Elsies River — its sub-place name (English spelling, "Elsies River...") otherwise starts with the area's own display name ("Elsies River"), which would match it by name fallback even though its `subPlaceNamePrefixes` selector (Afrikaans spelling, "Elsies Rivier") does not.

## Current inclusion set

The current version includes 11 areas:

- Bishop Lavis
- Bonteheuwel
- Elsies River
- Gugulethu
- Hanover Park
- Heideveld
- Khayelitsha
- Langa
- Manenberg
- Mitchells Plain
- Nyanga

Langa (established 1927, South Africa's oldest formally planned Black township), Nyanga (1946), and Gugulethu (1958) were Black African group areas under influx-control and Group Areas Act legislation. Khayelitsha (established 1983) is the largest and best-documented forced-removal-era township in Cape Town, absorbing much of the city's later apartheid-era Black African settlement. Mitchells Plain, Manenberg, Bonteheuwel, Heideveld, Hanover Park, and Elsies River are Coloured group areas, several receiving families displaced by District Six's 1966 proclamation and subsequent demolition.

Langa and Khayelitsha retain permanent overview labels; other areas use quieter secondary outlines and reveal their labels at detailed zoom levels. All areas remain available in the text browser.

## Limitations

Inclusion does not establish a legal apartheid-era classification, a date of proclamation, demographic composition, or uniform settlement history. Main-place/sub-place membership is a practical spatial grouping, not historical proof.

This is a first-pass, deliberately non-exhaustive set. Well-documented Cape Flats areas not yet included — Delft (built mostly post-1994, so of uncertain fit for an "apartheid-era" classification), Philippi and Crossroads (largely informal-settlement growth and forced-removal resistance history rather than formally proclaimed townships), and others — are left out pending further review rather than included speculatively. The classification should be extended only under the same conditions `docs/data/tshwane-area-classification.md` sets out: a stable Census code or explicit sub-place selector, a documented reason for inclusion, a check for mixed land uses and non-residential anomalies, and a review of how the area's label and boundary behave at desktop and mobile scales.

Future archival work should add dated proclamation or forced-removal geographies as separate evidence layers rather than silently treating this working classification as historical fact.
