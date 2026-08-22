export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_List_Layers_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "List this map's layers, each with its id, label, and whether it's currently visible." |
*
* @param {Webmcp_List_Layers_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_list_layers_description: ((inputs?: Webmcp_List_Layers_DescriptionInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_List_Layers_DescriptionInputs, {
    locale?: "en" | "af";
}, {}>;
