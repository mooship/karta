export type LocalizedString = import('../runtime.js').LocalizedString;
export type Meta_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Visualising how apartheid-era spatial planning still shapes commute times and access to jobs in Tshwane and Johannesburg." |
*
* @param {Meta_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const meta_description: ((inputs?: Meta_DescriptionInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Meta_DescriptionInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
