export type LocalizedString = import('../runtime.js').LocalizedString;
export type App_TitleInputs = {};
/**
* | output |
* | --- |
* | "Karta" |
*
* @param {App_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const app_title: ((inputs?: App_TitleInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<App_TitleInputs, {
    locale?: "en" | "af";
}, {}>;
