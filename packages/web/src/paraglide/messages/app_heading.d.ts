export type LocalizedString = import('../runtime.js').LocalizedString;
export type App_HeadingInputs = {};
/**
* | output |
* | --- |
* | "Karta: Gauteng spatial legacy map" |
*
* @param {App_HeadingInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const app_heading: ((inputs?: App_HeadingInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<App_HeadingInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
