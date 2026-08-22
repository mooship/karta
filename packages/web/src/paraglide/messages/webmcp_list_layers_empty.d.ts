export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_List_Layers_EmptyInputs = {};
/**
* | output |
* | --- |
* | "This map has no layers available." |
*
* @param {Webmcp_List_Layers_EmptyInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_list_layers_empty: ((inputs?: Webmcp_List_Layers_EmptyInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_List_Layers_EmptyInputs, {
    locale?: "en" | "af";
}, {}>;
