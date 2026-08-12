export type LocalizedString = import('../runtime.js').LocalizedString;
export type Meta_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Visualising how apartheid-era spatial planning still shapes commute times and access to jobs across Gauteng." |
*
* @param {Meta_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const meta_description: ((inputs?: Meta_DescriptionInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Meta_DescriptionInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
