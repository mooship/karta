export type LocalizedString = import('../runtime.js').LocalizedString;
export type Feature_Browser_EmptyInputs = {};
/**
* | output |
* | --- |
* | "Nothing matched that search." |
*
* @param {Feature_Browser_EmptyInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const feature_browser_empty: ((inputs?: Feature_Browser_EmptyInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Feature_Browser_EmptyInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
