export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Set_Basemap_Input_BasemapInputs = {};
/**
* | output |
* | --- |
* | "One of the registered basemap ids." |
*
* @param {Webmcp_Set_Basemap_Input_BasemapInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_set_basemap_input_basemap: ((inputs?: Webmcp_Set_Basemap_Input_BasemapInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_Input_BasemapInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
