export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Toggle_Layer_Input_Layer_IdInputs = {};
/**
* | output |
* | --- |
* | "The layer's id, as returned by list-map-layers." |
*
* @param {Webmcp_Toggle_Layer_Input_Layer_IdInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_toggle_layer_input_layer_id: ((inputs?: Webmcp_Toggle_Layer_Input_Layer_IdInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_Input_Layer_IdInputs, {
    locale?: "en" | "af";
}, {}>;
