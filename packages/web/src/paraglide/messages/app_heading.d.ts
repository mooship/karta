export type LocalizedString = import('../runtime.js').LocalizedString;
export type App_HeadingInputs = {};
/**
* | output |
* | --- |
* | "Karta: Gauteng spatial legacy map" |
*
* @param {App_HeadingInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const app_heading: ((inputs?: App_HeadingInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<App_HeadingInputs, {
    locale?: "en" | "af";
}, {}>;
