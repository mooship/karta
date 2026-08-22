export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Measure_Distance_ResultInputs = {
    locations: NonNullable<unknown>;
    result: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Distance along {locations}: {result}." |
*
* @param {Webmcp_Measure_Distance_ResultInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_measure_distance_result: ((inputs: Webmcp_Measure_Distance_ResultInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Distance_ResultInputs, {
    locale?: "en" | "af";
}, {}>;
