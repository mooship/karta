export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Group_Transport_Costs_TitleInputs = {};
/**
* | output |
* | --- |
* | "Transport costs" |
*
* @param {Layer_Group_Transport_Costs_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_group_transport_costs_title: ((inputs?: Layer_Group_Transport_Costs_TitleInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Transport_Costs_TitleInputs, {
    locale?: "en" | "af";
}, {}>;
