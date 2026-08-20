export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Measure_Distance_Input_LocationsInputs = {};
/**
* | output |
* | --- |
* | "Place names to measure between, in order, e.g. [\"Sandton\", \"Soweto\"]." |
*
* @param {Webmcp_Measure_Distance_Input_LocationsInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_measure_distance_input_locations: ((inputs?: Webmcp_Measure_Distance_Input_LocationsInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Distance_Input_LocationsInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
