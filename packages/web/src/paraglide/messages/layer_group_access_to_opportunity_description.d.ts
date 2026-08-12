export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Group_Access_To_Opportunity_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Only one overlay can be active at a time." |
*
* @param {Layer_Group_Access_To_Opportunity_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export declare const layer_group_access_to_opportunity_description: ((inputs?: Layer_Group_Access_To_Opportunity_DescriptionInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Access_To_Opportunity_DescriptionInputs, {
    locale?: "en" | "st" | "zu" | "xh";
}, {}>;
