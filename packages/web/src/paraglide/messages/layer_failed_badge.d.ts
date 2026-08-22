export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Failed_BadgeInputs = {};
/**
* | output |
* | --- |
* | "Failed to load — toggle off and on to retry" |
*
* @param {Layer_Failed_BadgeInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_failed_badge: ((inputs?: Layer_Failed_BadgeInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Failed_BadgeInputs, {
    locale?: "en" | "af";
}, {}>;
