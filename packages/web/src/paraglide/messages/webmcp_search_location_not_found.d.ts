export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Search_Location_Not_FoundInputs = {
    query: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "No location found matching \"{query}\"." |
*
* @param {Webmcp_Search_Location_Not_FoundInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_search_location_not_found: ((inputs: Webmcp_Search_Location_Not_FoundInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Search_Location_Not_FoundInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
