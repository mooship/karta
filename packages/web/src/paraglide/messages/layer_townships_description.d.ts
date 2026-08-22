export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Townships_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Modelled car drive-time from each recognised township area to its nearest selected job centre." |
*
* @param {Layer_Townships_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_townships_description: ((inputs?: Layer_Townships_DescriptionInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Townships_DescriptionInputs, {
    locale?: "en" | "af";
}, {}>;
