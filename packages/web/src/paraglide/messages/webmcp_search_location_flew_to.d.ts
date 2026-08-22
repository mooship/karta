export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Search_Location_Flew_ToInputs = {
    location: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Flew to {location}." |
*
* @param {Webmcp_Search_Location_Flew_ToInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_search_location_flew_to: ((inputs: Webmcp_Search_Location_Flew_ToInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Search_Location_Flew_ToInputs, {
    locale?: "en" | "af";
}, {}>;
