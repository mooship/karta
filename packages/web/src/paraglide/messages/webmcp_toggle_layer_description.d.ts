export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Toggle_Layer_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Show or hide a map layer by id. Call list-map-layers first to find valid ids." |
*
* @param {Webmcp_Toggle_Layer_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_toggle_layer_description: ((inputs?: Webmcp_Toggle_Layer_DescriptionInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_DescriptionInputs, {
    locale?: "en" | "af";
}, {}>;
