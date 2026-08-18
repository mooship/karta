export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Group_Heritage_TitleInputs = {};
/**
* | output |
* | --- |
* | "Heritage" |
*
* @param {Layer_Group_Heritage_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_group_heritage_title: ((inputs?: Layer_Group_Heritage_TitleInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Heritage_TitleInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
