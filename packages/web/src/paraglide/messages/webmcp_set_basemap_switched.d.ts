export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Set_Basemap_SwitchedInputs = {
    basemap: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Basemap switched to \"{basemap}\"." |
*
* @param {Webmcp_Set_Basemap_SwitchedInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_set_basemap_switched: ((inputs: Webmcp_Set_Basemap_SwitchedInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_SwitchedInputs, {
    locale?: "en" | "af";
}, {}>;
