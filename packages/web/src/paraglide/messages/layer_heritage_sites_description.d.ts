export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Heritage_Sites_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Approximate locations of publicly documented sites significant to South Africa's anti-apartheid and democracy history." |
*
* @param {Layer_Heritage_Sites_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_heritage_sites_description: ((inputs?: Layer_Heritage_Sites_DescriptionInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Heritage_Sites_DescriptionInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
