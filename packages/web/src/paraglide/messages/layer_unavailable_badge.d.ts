export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Unavailable_BadgeInputs = {};
/**
* | output |
* | --- |
* | "Not yet available" |
*
* @param {Layer_Unavailable_BadgeInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_unavailable_badge: ((inputs?: Layer_Unavailable_BadgeInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Unavailable_BadgeInputs, {
    locale?: "en" | "af";
}, {}>;
