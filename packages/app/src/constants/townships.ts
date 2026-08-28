import type { MetroId } from "./metros";

/**
 * How a township area's boundary is identified: by an explicit census
 * main-place code (`censusMainPlaceCodes`), or by matching sub-place names
 * (`subPlaceNamePrefixes`).
 */
export type TownshipAreaSelectionBasis =
  | "census-main-place"
  | "named-sub-places";

/**
 * How eagerly this area's map label is revealed while zooming in.
 * @remarks A large `"primary"` area (many sub-places) shows its label
 *   immediately; smaller `"primary"` areas reveal at a medium zoom, and
 *   `"secondary"` areas only at a closer zoom still — see
 *   `PRIMARY_LABEL_REVEAL_ZOOM`/`SECONDARY_LABEL_REVEAL_ZOOM` in
 *   `@karta/map`'s `MapView`.
 */
export type TownshipAreaLabelPriority = "primary" | "secondary";

/** One recognised township area: its identity, metro, and matching rules for the census sub-place features that make it up. */
export interface TownshipAreaDefinition {
  id: string;
  name: string;
  metroId: MetroId;
  selectionBasis: TownshipAreaSelectionBasis;
  labelPriority: TownshipAreaLabelPriority;
  /** Pixel offset `[x, y]` for this area's map label, to avoid overlapping nearby features. */
  labelOffset?: readonly [number, number];
  /** Census 2011 main-place code prefixes identifying this area's boundary features. */
  censusMainPlaceCodes?: readonly string[];
  /** Name prefixes matching this area's census sub-place features, when a main-place code isn't specific enough. */
  subPlaceNamePrefixes?: readonly string[];
  /** Sub-place names explicitly excluded from this area, to override an otherwise-matching prefix/name. */
  excludedSubPlaceNames?: readonly string[];
}

type TownshipAreaDefinitionInput = Omit<TownshipAreaDefinition, "metroId">;

const TSHWANE_TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinitionInput[] =
  [
    {
      id: "atteridgeville",
      name: "Atteridgeville",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["799057"],
    },
    {
      id: "bosplaas-mathabe",
      name: "Bosplaas Mathabe",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799001"],
    },
    {
      id: "dilopye",
      name: "Dilopye",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799010"],
    },
    {
      id: "eersterust",
      name: "Eersterust",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799046"],
    },
    {
      id: "ekangala",
      name: "Ekangala",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799055"],
      excludedSubPlaceNames: ["Ekandustria"],
    },
    {
      id: "ga-rankuwa",
      name: "Ga-Rankuwa",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799035", "799036"],
    },
    {
      id: "hebron",
      name: "Hebron",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799034"],
    },
    {
      id: "kekana-garden",
      name: "Kekana Garden",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799006"],
    },
    {
      id: "laudium",
      name: "Laudium",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799059"],
    },
    {
      id: "kudube",
      name: "Kudube",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Kudube"],
    },
    {
      id: "lotus-gardens",
      name: "Lotus Gardens",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Lotus Gardens"],
    },
    {
      id: "mabopane",
      name: "Mabopane",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799016"],
    },
    {
      id: "majaneng",
      name: "Majaneng",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799003"],
    },
    {
      id: "makanyaneng",
      name: "Makanyaneng",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799017"],
    },
    {
      id: "mamelodi",
      name: "Mamelodi",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["799045"],
    },
    {
      id: "mandela-village",
      name: "Mandela Village",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799019"],
    },
    {
      id: "marokolong",
      name: "Marokolong",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799007"],
    },
    {
      id: "mashemong",
      name: "Mashemong",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799002"],
    },
    {
      id: "nellmapius",
      name: "Nellmapius",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799054"],
    },
    {
      id: "new-eersterus",
      name: "New Eersterus",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799012"],
    },
    {
      id: "olievenhoutbosch",
      name: "Olievenhoutbosch",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799078"],
      subPlaceNamePrefixes: ["Olievenhoutbos"],
    },
    {
      id: "ramotse",
      name: "Ramotse",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799005"],
    },
    {
      id: "refilwe",
      name: "Refilwe",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799049"],
    },
    {
      id: "rethabiseng",
      name: "Rethabiseng",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799056"],
    },
    {
      id: "saulsville",
      name: "Saulsville",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      labelOffset: [0, 18],
      censusMainPlaceCodes: ["799058"],
    },
    {
      id: "plastic-view",
      name: "Plastic View",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Plastic View"],
    },
    {
      id: "soshanguve",
      name: "Soshanguve",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["799014"],
      excludedSubPlaceNames: ["Tswaing Nature Reserve"],
    },
    {
      id: "soutpan",
      name: "Soutpan",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799013"],
    },
    {
      id: "stinkwater",
      name: "Stinkwater",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799011"],
    },
    {
      id: "suurman",
      name: "Suurman",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799009"],
    },
    {
      id: "temba",
      name: "Temba",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["799008"],
    },
    {
      id: "tsebe",
      name: "Tsebe",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799018"],
    },
    {
      id: "winterveld",
      name: "Winterveld",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799015"],
    },
    {
      id: "zithobeni",
      name: "Zithobeni",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["799062"],
    },
  ];

// Selected from the City of Johannesburg's Census 2011 sub-places (MN_CODE
// 798) using the same two rules as Tshwane's classification (see
// docs/data/johannesburg-area-classification.md): whole Census main places
// for township areas with their own distinct code, and named sub-place
// prefixes for historic townships whose main place is mixed (e.g. Randburg,
// Johannesburg, Roodepoort) and can't safely be included wholesale.
const JOHANNESBURG_TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinitionInput[] =
  [
    {
      id: "alexandra",
      name: "Alexandra",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["798027"],
    },
    {
      id: "klipspruit",
      name: "Klipspruit",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Klipspruit"],
    },
    {
      id: "protea-south",
      name: "Protea South",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Protea South"],
    },
    {
      id: "slovoville",
      name: "Slovoville",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Slovoville"],
    },
    {
      id: "soweto",
      name: "Soweto",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["798030"],
    },
    {
      id: "diepsloot",
      name: "Diepsloot",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["798003"],
    },
    {
      id: "orange-farm",
      name: "Orange Farm",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["798036"],
    },
    {
      id: "ivory-park",
      name: "Ivory Park",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798006"],
    },
    {
      id: "kaalfontein",
      name: "Kaalfontein",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798005"],
    },
    {
      id: "ebony-park",
      name: "Ebony Park",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798007"],
    },
    {
      id: "rabie-ridge",
      name: "Rabie Ridge",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798008"],
    },
    {
      id: "mayibuye",
      name: "Mayibuye",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798009"],
    },
    {
      id: "lenasia",
      name: "Lenasia",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798031"],
    },
    {
      id: "lenasia-south",
      name: "Lenasia South",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798034"],
    },
    {
      id: "lehae",
      name: "Lehae",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798032"],
    },
    {
      id: "vlakfontein",
      name: "Vlakfontein",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798033"],
    },
    {
      id: "ennerdale",
      name: "Ennerdale",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798035"],
    },
    {
      id: "drie-ziek",
      name: "Drie Ziek",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798037"],
    },
    {
      id: "stretford",
      name: "Stretford",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798038"],
    },
    {
      id: "lakeside",
      name: "Lakeside",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798039"],
    },
    {
      id: "lawley",
      name: "Lawley",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798040"],
    },
    {
      id: "kanana-park",
      name: "Kanana Park",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798041"],
    },
    {
      id: "poortjie",
      name: "Poortjie",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798042"],
    },
    {
      id: "kya-sand",
      name: "Kya Sand",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["798023"],
    },
    {
      id: "cosmo-city",
      name: "Cosmo City",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Cosmo City"],
    },
    {
      id: "zandspruit",
      name: "Zandspruit",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Zandspruit"],
    },
    {
      id: "matholesville",
      name: "Matholesville",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Matholesville"],
    },
    {
      id: "eldorado-park",
      name: "Eldorado Park",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Eldorado Park"],
    },
    {
      id: "newclare",
      name: "Newclare",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Newclare"],
    },
    {
      id: "bosmont",
      name: "Bosmont",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Bosmont"],
    },
    {
      id: "riverlea",
      name: "Riverlea",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Riverlea"],
    },
    {
      id: "westbury",
      name: "Westbury",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Westbury"],
    },
    {
      id: "coronationville",
      name: "Coronationville",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Coronationville"],
    },
  ];

const EKURHULENI_TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinitionInput[] =
  [
    {
      id: "tembisa",
      name: "Tembisa",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Tembisa", "Thembisa"],
    },
    {
      id: "katlehong",
      name: "Katlehong",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Katlehong"],
    },
    {
      id: "thokoza",
      name: "Thokoza",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Thokoza", "Tokoza"],
    },
    {
      id: "vosloorus",
      name: "Vosloorus",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Vosloorus"],
    },
    {
      id: "daveyton",
      name: "Daveyton",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Daveyton"],
    },
    {
      id: "wattville",
      name: "Wattville",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Wattville"],
    },
    {
      id: "kwathema",
      name: "KwaThema",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Kwa-Thema"],
    },
    {
      id: "duduza",
      name: "Duduza",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Duduza"],
    },
    {
      id: "tsakane",
      name: "Tsakane",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Tsakane"],
    },
    {
      id: "etwatwa",
      name: "Etwatwa",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Etwatwa"],
    },
    {
      id: "zonkizizwe",
      name: "Zonkizizwe",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Zonkizizwe"],
    },
    {
      id: "langaville",
      name: "Langaville",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Langaville"],
    },
    {
      id: "actonville",
      name: "Actonville",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Actonville"],
    },
    {
      id: "reiger-park",
      name: "Reiger Park",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Reiger Park"],
    },
    {
      id: "chief-albert-luthuli-park",
      name: "Chief Albert Luthuli Park",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Chief A Luthuli Park"],
    },
    {
      id: "clayville",
      name: "Clayville",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Clayville"],
    },
    {
      id: "primrose",
      name: "Primrose",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Primrose"],
    },
    {
      id: "joe-slovo-boksburg",
      name: "Joe Slovo",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Joe Slovo"],
    },
    {
      id: "ulana-park",
      name: "Ulana Park",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Ulana"],
    },
    {
      id: "hlahane",
      name: "Hlahane",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Hlahane"],
    },
    {
      id: "driefontein",
      name: "Driefontein",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Driefontein"],
    },
    {
      id: "bapsfontein",
      name: "Bapsfontein",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Bapsfontein"],
    },
    {
      id: "breswol",
      name: "Breswol",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Breswol"],
    },
    {
      id: "dukathole",
      name: "Dukathole",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Dukathole"],
    },
    {
      id: "geluksdal",
      name: "Geluksdal",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Geluksdal"],
    },
    {
      id: "harry-gwala",
      name: "Harry Gwala",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Harry Gwala"],
    },
    {
      id: "holfontein",
      name: "Holfontein",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Holfontein"],
    },
    {
      id: "kanana",
      name: "Kanana",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Kanana"],
    },
    {
      id: "lindelani-village",
      name: "Lindelani Village",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Lindelani Village"],
    },
    {
      id: "thinasonke",
      name: "Thinasonke",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Thinasonke"],
    },
    {
      id: "tweefontein",
      name: "Tweefontein",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Tweefontein"],
    },
  ];

const EMFULENI_TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinitionInput[] =
  [
    {
      id: "emfuleni-sebokeng",
      name: "Sebokeng",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["760004"],
    },
    {
      id: "emfuleni-evaton",
      name: "Evaton",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["760002"],
    },
    {
      id: "emfuleni-boipatong",
      name: "Boipatong",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["760008"],
    },
    {
      id: "emfuleni-sharpeville",
      name: "Sharpeville",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["760013"],
    },
    {
      id: "emfuleni-bophelong",
      name: "Bophelong",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["760014"],
    },
    {
      id: "emfuleni-tshepiso",
      name: "Tshepiso",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["760007"],
    },
    {
      id: "emfuleni-tshepong",
      name: "Tshepong",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["760005"],
    },
    {
      id: "emfuleni-stretford",
      name: "Stretford",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["760001"],
    },
    {
      id: "emfuleni-lakeside",
      name: "Lakeside",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["760003"],
    },
    {
      id: "emfuleni-golden-gardens",
      name: "Golden Gardens",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["760012"],
    },
  ];

const MIDVAAL_TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinitionInput[] =
  [
    {
      id: "midvaal-mamello",
      name: "Mamello",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["761011"],
    },
    {
      id: "midvaal-evaton",
      name: "Evaton",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["761008"],
    },
  ];

const LESEDI_TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinitionInput[] =
  [
    {
      id: "lesedi-ratanda",
      name: "Ratanda",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["762015"],
    },
    {
      id: "lesedi-impumelelo",
      name: "Impumelelo",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["762005"],
    },
    {
      id: "lesedi-devon",
      name: "Devon",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["762006", "762007"],
    },
    {
      id: "lesedi-endicott",
      name: "Endicott",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["762003"],
    },
  ];

const MOGALE_CITY_TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinitionInput[] =
  [
    {
      id: "mogale-kagiso",
      name: "Kagiso",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["763011"],
    },
    {
      id: "mogale-munsieville",
      name: "Munsieville",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["763005"],
    },
    {
      id: "mogale-rietvallei",
      name: "Rietvallei",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["763012"],
    },
    {
      id: "mogale-orient-hills",
      name: "Orient Hills",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["763007"],
    },
  ];

const RAND_WEST_CITY_TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinitionInput[] =
  [
    {
      id: "rand-west-mohlakeng",
      name: "Mohlakeng",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["764004"],
    },
    {
      id: "rand-west-bekkersdal",
      name: "Bekkersdal",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["765002"],
    },
    {
      id: "rand-west-simunye",
      name: "Simunye",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["765007"],
    },
    {
      id: "rand-west-glen-harvie",
      name: "Glen Harvie",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["765014"],
    },
    {
      id: "rand-west-zenzele",
      name: "Zenzele",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["764005"],
    },
  ];

const MERAFONG_CITY_TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinitionInput[] =
  [
    {
      id: "merafong-khutsong",
      name: "Khutsong",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["766003"],
    },
    {
      id: "merafong-kokosi",
      name: "Kokosi",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["766026"],
    },
    {
      id: "merafong-wedela",
      name: "Wedela",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["766023"],
    },
    {
      id: "merafong-welverdiend",
      name: "Welverdiend",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["766010"],
    },
  ];

// Selected from the City of Cape Town's Census 2011 sub-places (MN_CODE 199).
// Langa, Nyanga, Gugulethu, Khayelitsha, Mitchells Plain, and Bishop Lavis
// each have their own distinct Census main place and are included wholesale
// via `census-main-place`, matching Tshwane/Johannesburg's own primary-area
// pattern. Manenberg, Bonteheuwel, Heideveld, and Hanover Park are distinct
// sub-places within the mixed "Athlone" main place (which also covers many
// non-township suburbs) and so use `named-sub-places`, matching
// Johannesburg's Klipspruit/Protea South pattern. Elsies River is likewise
// `named-sub-places`, matching only "Elsies Rivier SP" — its main place's
// English-spelled "Elsies River Industrial" sub-place is a separate,
// non-residential area. See docs/data/cape-town-area-classification.md.
const CAPE_TOWN_TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinitionInput[] =
  [
    {
      id: "langa",
      name: "Langa",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["199027"],
    },
    {
      id: "nyanga",
      name: "Nyanga",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["199035"],
    },
    {
      id: "gugulethu",
      name: "Gugulethu",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["199034"],
    },
    {
      id: "khayelitsha",
      name: "Khayelitsha",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["199043"],
    },
    {
      id: "mitchells-plain",
      name: "Mitchells Plain",
      selectionBasis: "census-main-place",
      labelPriority: "primary",
      censusMainPlaceCodes: ["199044"],
    },
    {
      id: "bishop-lavis",
      name: "Bishop Lavis",
      selectionBasis: "census-main-place",
      labelPriority: "secondary",
      censusMainPlaceCodes: ["199040"],
    },
    {
      id: "manenberg",
      name: "Manenberg",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Manenberg"],
    },
    {
      id: "bonteheuwel",
      name: "Bonteheuwel",
      selectionBasis: "named-sub-places",
      labelPriority: "primary",
      subPlaceNamePrefixes: ["Bonteheuwel"],
    },
    {
      id: "heideveld",
      name: "Heideveld",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Heideveld"],
    },
    {
      id: "hanover-park",
      name: "Hanover Park",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Hanover Park"],
    },
    {
      id: "elsies-river",
      name: "Elsies River",
      selectionBasis: "named-sub-places",
      labelPriority: "secondary",
      subPlaceNamePrefixes: ["Elsies Rivier"],
      excludedSubPlaceNames: ["Elsies River Industrial"],
    },
  ];

/** Pairs each metro's own township area list with its `metroId`, feeding `TOWNSHIP_AREA_DEFINITIONS`. */
const TOWNSHIP_AREA_DEFINITIONS_BY_METRO: readonly (readonly [
  MetroId,
  readonly TownshipAreaDefinitionInput[],
])[] = [
  ["tshwane", TSHWANE_TOWNSHIP_AREA_DEFINITIONS],
  ["johannesburg", JOHANNESBURG_TOWNSHIP_AREA_DEFINITIONS],
  ["ekurhuleni", EKURHULENI_TOWNSHIP_AREA_DEFINITIONS],
  ["emfuleni", EMFULENI_TOWNSHIP_AREA_DEFINITIONS],
  ["midvaal", MIDVAAL_TOWNSHIP_AREA_DEFINITIONS],
  ["lesedi", LESEDI_TOWNSHIP_AREA_DEFINITIONS],
  ["mogale-city", MOGALE_CITY_TOWNSHIP_AREA_DEFINITIONS],
  ["rand-west-city", RAND_WEST_CITY_TOWNSHIP_AREA_DEFINITIONS],
  ["merafong-city", MERAFONG_CITY_TOWNSHIP_AREA_DEFINITIONS],
  ["cape-town", CAPE_TOWN_TOWNSHIP_AREA_DEFINITIONS],
];

/** Every recognised township area across all nine Gauteng metros and City of Cape Town, flattened from each metro's own list with `metroId` attached. */
export const TOWNSHIP_AREA_DEFINITIONS: readonly TownshipAreaDefinition[] =
  TOWNSHIP_AREA_DEFINITIONS_BY_METRO.flatMap(([metroId, definitions]) =>
    definitions.map((definition) => ({ ...definition, metroId })),
  );

function findByCensusCode(
  areas: TownshipAreaDefinition[],
  censusId: string,
): TownshipAreaDefinition | undefined {
  return areas.find((area) =>
    area.censusMainPlaceCodes?.some((code) => censusId.startsWith(code)),
  );
}

function bestMatch(
  matches: TownshipAreaDefinition[],
  censusId: string | undefined,
): TownshipAreaDefinition | undefined {
  if (censusId) {
    const codeMatch = findByCensusCode(matches, censusId);
    if (codeMatch) {
      return codeMatch;
    }
  }

  return matches[0];
}

const areaDefinitionCache = new Map<
  string,
  TownshipAreaDefinition | undefined
>();

function resolveTownshipAreaDefinition(
  name: string,
  censusId?: string,
): TownshipAreaDefinition | undefined {
  const prefixMatches: TownshipAreaDefinition[] = [];
  const nameMatches: TownshipAreaDefinition[] = [];

  for (const area of TOWNSHIP_AREA_DEFINITIONS) {
    if (area.excludedSubPlaceNames?.includes(name)) {
      continue;
    }
    if (area.subPlaceNamePrefixes?.some((prefix) => name.startsWith(prefix))) {
      prefixMatches.push(area);
    } else if (name.startsWith(area.name)) {
      // Only consulted when no area matched by prefix, so an area that did
      // match one never needs to appear in both lists.
      nameMatches.push(area);
    }
  }

  if (prefixMatches.length > 0) {
    return bestMatch(prefixMatches, censusId);
  }
  if (nameMatches.length > 0) {
    return bestMatch(nameMatches, censusId);
  }
  if (censusId) {
    // Only reached once neither match list above found anything, so the
    // full-array filter here isn't paid on the common case above.
    const availableAreas = TOWNSHIP_AREA_DEFINITIONS.filter(
      (area) => !area.excludedSubPlaceNames?.includes(name),
    );
    return findByCensusCode(availableAreas, censusId);
  }
  return undefined;
}

/**
 * Finds the township area a census sub-place belongs to, by matching its
 * name (and, to disambiguate multiple matches, its census id) against every
 * area's `subPlaceNamePrefixes`/`censusMainPlaceCodes`.
 * @param name - The sub-place's name.
 * @param censusId - The sub-place's census code, used to disambiguate when
 *   more than one area's name/prefix matches.
 * @returns The matching area, or `undefined` if none matches.
 * @remarks Results are memoised. The answer depends only on module-level
 *   constants, and map rendering asks it the same question repeatedly — once
 *   per sub-place feature per style pass, thousands of features at a time —
 *   so recomputing three scans of every area definition each time is pure
 *   main-thread cost while the map is drawing. The cache is bounded in
 *   practice by the number of distinct sub-place names in the published
 *   data.
 */
export function getTownshipAreaDefinition(
  name: string,
  censusId?: string,
): TownshipAreaDefinition | undefined {
  const cacheKey = `${name} ${censusId ?? ""}`;
  if (areaDefinitionCache.has(cacheKey)) {
    return areaDefinitionCache.get(cacheKey);
  }
  const definition = resolveTownshipAreaDefinition(name, censusId);
  areaDefinitionCache.set(cacheKey, definition);
  return definition;
}

/** Like `getTownshipAreaDefinition`, but returns just the matched area's display name. */
export function getTownshipGroup(
  name: string,
  censusId?: string,
): string | undefined {
  return getTownshipAreaDefinition(name, censusId)?.name;
}
