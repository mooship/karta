export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Nearest_Transit_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Straight-line distance from each recognised township area to the nearest formal transit route." |
*
* @param {Layer_Nearest_Transit_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const layer_nearest_transit_description: ((inputs?: Layer_Nearest_Transit_DescriptionInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Nearest_Transit_DescriptionInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
