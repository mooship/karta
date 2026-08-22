export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Search_Location_Input_QueryInputs = {};
/**
* | output |
* | --- |
* | "Free-text place name to search for." |
*
* @param {Webmcp_Search_Location_Input_QueryInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_search_location_input_query: ((inputs?: Webmcp_Search_Location_Input_QueryInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Search_Location_Input_QueryInputs, {
    locale?: "en" | "af";
}, {}>;
