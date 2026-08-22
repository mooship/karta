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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_set_basemap_unknown: ((inputs: Webmcp_Set_Basemap_UnknownInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_UnknownInputs, {
    locale?: "en" | "af";
}, {}>;
