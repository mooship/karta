export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Group_Access_To_Opportunity_TitleInputs = {};
/**
* | output |
* | --- |
* | "Accessibility overlays" |
*
* @param {Layer_Group_Access_To_Opportunity_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const layer_group_access_to_opportunity_title: ((inputs?: Layer_Group_Access_To_Opportunity_TitleInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Access_To_Opportunity_TitleInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
