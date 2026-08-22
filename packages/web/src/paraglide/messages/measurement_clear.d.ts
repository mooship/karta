export type LocalizedString = import('../runtime.js').LocalizedString;
export type Measurement_ClearInputs = {};
/**
* | output |
* | --- |
* | "Clear" |
*
* @param {Measurement_ClearInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const measurement_clear: ((inputs?: Measurement_ClearInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_ClearInputs, {
    locale?: "en" | "af";
}, {}>;
