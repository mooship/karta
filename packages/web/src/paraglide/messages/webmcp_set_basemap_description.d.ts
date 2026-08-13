export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Set_Basemap_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Switch the map's basemap style." |
*
* @param {Webmcp_Set_Basemap_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_set_basemap_description: ((inputs?: Webmcp_Set_Basemap_DescriptionInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_DescriptionInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
