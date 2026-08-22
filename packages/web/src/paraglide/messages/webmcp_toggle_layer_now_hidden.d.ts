export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Toggle_Layer_Now_HiddenInputs = {
    label: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Layer \"{label}\" is now hidden." |
*
* @param {Webmcp_Toggle_Layer_Now_HiddenInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_toggle_layer_now_hidden: ((inputs: Webmcp_Toggle_Layer_Now_HiddenInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_Now_HiddenInputs, {
    locale?: "en" | "af";
}, {}>;
