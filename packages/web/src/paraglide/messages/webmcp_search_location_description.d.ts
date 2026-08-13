export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Search_Location_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Search for a place by name and fly the map to the best match, e.g. a town, suburb or station." |
*
* @param {Webmcp_Search_Location_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_search_location_description: ((inputs?: Webmcp_Search_Location_DescriptionInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Search_Location_DescriptionInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
