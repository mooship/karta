export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Measure_Distance_Too_FewInputs = {};
/**
* | output |
* | --- |
* | "Provide at least two locations to measure a distance." |
*
* @param {Webmcp_Measure_Distance_Too_FewInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_measure_distance_too_few: ((inputs?: Webmcp_Measure_Distance_Too_FewInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Distance_Too_FewInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
