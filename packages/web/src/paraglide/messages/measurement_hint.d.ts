export type LocalizedString = import('../runtime.js').LocalizedString;
export type Measurement_HintInputs = {};
/**
* | output |
* | --- |
* | "Click the map to start measuring." |
*
* @param {Measurement_HintInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const measurement_hint: ((inputs?: Measurement_HintInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_HintInputs, {
    locale?: "en" | "af";
}, {}>;
