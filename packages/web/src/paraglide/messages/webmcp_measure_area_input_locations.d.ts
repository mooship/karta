export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Measure_Area_Input_LocationsInputs = {};
/**
* | output |
* | --- |
* | "Place names forming the area's outline, in order, e.g. [\"Sandton\", \"Soweto\", \"Midrand\"]." |
*
* @param {Webmcp_Measure_Area_Input_LocationsInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_measure_area_input_locations: ((inputs?: Webmcp_Measure_Area_Input_LocationsInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_Input_LocationsInputs, {
    locale?: "en" | "af";
}, {}>;
