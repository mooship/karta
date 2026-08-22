export type LocalizedString = import('../runtime.js').LocalizedString;
export type Legend_TitleInputs = {};
/**
* | output |
* | --- |
* | "Map legend" |
*
* @param {Legend_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const legend_title: ((inputs?: Legend_TitleInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_TitleInputs, {
    locale?: "en" | "af";
}, {}>;
