export type LocalizedString = import('../runtime.js').LocalizedString;
export type Loading_MapInputs = {};
/**
* | output |
* | --- |
* | "Loading map" |
*
* @param {Loading_MapInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const loading_map: ((inputs?: Loading_MapInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Loading_MapInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
