export type LocalizedString = import('../runtime.js').LocalizedString;
export type Measurement_Back_To_MapInputs = {};
/**
* | output |
* | --- |
* | "Back to map" |
*
* @param {Measurement_Back_To_MapInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const measurement_back_to_map: ((inputs?: Measurement_Back_To_MapInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_Back_To_MapInputs, {
    locale?: "en" | "af";
}, {}>;
