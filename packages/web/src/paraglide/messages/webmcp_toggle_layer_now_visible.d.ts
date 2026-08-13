export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Toggle_Layer_Now_VisibleInputs = {
    label: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Layer \"{label}\" is now visible." |
*
* @param {Webmcp_Toggle_Layer_Now_VisibleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_toggle_layer_now_visible: ((inputs: Webmcp_Toggle_Layer_Now_VisibleInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_Now_VisibleInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
