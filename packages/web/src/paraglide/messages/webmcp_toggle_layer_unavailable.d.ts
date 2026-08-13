export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Toggle_Layer_UnavailableInputs = {
    label: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Layer \"{label}\" isn't available yet." |
*
* @param {Webmcp_Toggle_Layer_UnavailableInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_toggle_layer_unavailable: ((inputs: Webmcp_Toggle_Layer_UnavailableInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_UnavailableInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
