export type LocalizedString = import('../runtime.js').LocalizedString;
export type Measurement_TitleInputs = {};
/**
* | output |
* | --- |
* | "Measure" |
*
* @param {Measurement_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const measurement_title: ((inputs?: Measurement_TitleInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_TitleInputs, {
    locale?: "en" | "af";
}, {}>;
