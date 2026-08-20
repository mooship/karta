export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Measure_Area_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Measure the area enclosed by three or more named locations, and show it on the map's measuring tool." |
*
* @param {Webmcp_Measure_Area_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_measure_area_description: ((inputs?: Webmcp_Measure_Area_DescriptionInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_DescriptionInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
