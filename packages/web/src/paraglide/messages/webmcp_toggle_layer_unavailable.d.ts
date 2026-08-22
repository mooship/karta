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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_toggle_layer_unavailable: ((inputs: Webmcp_Toggle_Layer_UnavailableInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_UnavailableInputs, {
    locale?: "en" | "af";
}, {}>;
