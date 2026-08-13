export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Toggle_Layer_UnknownInputs = {
    layerId: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "No layer with id \"{layerId}\". Call list-map-layers to see valid ids." |
*
* @param {Webmcp_Toggle_Layer_UnknownInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_toggle_layer_unknown: ((inputs: Webmcp_Toggle_Layer_UnknownInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_UnknownInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
