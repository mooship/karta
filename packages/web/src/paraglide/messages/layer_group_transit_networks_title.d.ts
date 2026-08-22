export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Group_Transit_Networks_TitleInputs = {};
/**
* | output |
* | --- |
* | "Transit networks" |
*
* @param {Layer_Group_Transit_Networks_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_group_transit_networks_title: ((inputs?: Layer_Group_Transit_Networks_TitleInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Transit_Networks_TitleInputs, {
    locale?: "en" | "af";
}, {}>;
