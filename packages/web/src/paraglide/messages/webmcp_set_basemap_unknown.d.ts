export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Set_Basemap_UnknownInputs = {
    basemap: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Unknown basemap \"{basemap}\"." |
*
* @param {Webmcp_Set_Basemap_UnknownInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_set_basemap_unknown: ((inputs: Webmcp_Set_Basemap_UnknownInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_UnknownInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
