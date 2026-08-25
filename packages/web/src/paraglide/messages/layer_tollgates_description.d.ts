export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Tollgates_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Approximate locations of physical toll plazas on Gauteng's tolled highways — a direct cost of car-based commuting alongside modelled drive time." |
*
* @param {Layer_Tollgates_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_tollgates_description: ((inputs?: Layer_Tollgates_DescriptionInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Tollgates_DescriptionInputs, {
    locale?: "en" | "af";
}, {}>;
