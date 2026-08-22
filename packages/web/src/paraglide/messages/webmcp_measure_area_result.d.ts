export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Measure_Area_ResultInputs = {
    locations: NonNullable<unknown>;
    result: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Area enclosed by {locations}: {result}." |
*
* @param {Webmcp_Measure_Area_ResultInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_measure_area_result: ((inputs: Webmcp_Measure_Area_ResultInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_ResultInputs, {
    locale?: "en" | "af";
}, {}>;
