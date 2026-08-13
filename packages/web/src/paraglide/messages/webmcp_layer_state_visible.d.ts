export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Layer_State_VisibleInputs = {};
/**
* | output |
* | --- |
* | "visible" |
*
* @param {Webmcp_Layer_State_VisibleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_layer_state_visible: ((inputs?: Webmcp_Layer_State_VisibleInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Layer_State_VisibleInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
