export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Layer_State_HiddenInputs = {};
/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{}} Webmcp_Layer_State_HiddenInputs */
/**
* | output |
* | --- |
* | "hidden" |
*
* @param {Webmcp_Layer_State_HiddenInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_layer_state_hidden: ((inputs?: Webmcp_Layer_State_HiddenInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Layer_State_HiddenInputs, {
    locale?: "en" | "af";
}, {}>;
