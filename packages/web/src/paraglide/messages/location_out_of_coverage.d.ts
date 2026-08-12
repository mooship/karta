export type LocalizedString = import('../runtime.js').LocalizedString;
export type Location_Out_Of_CoverageInputs = {
    location: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "{location} is outside South Africa." |
*
* @param {Location_Out_Of_CoverageInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export declare const location_out_of_coverage: ((inputs: Location_Out_Of_CoverageInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Out_Of_CoverageInputs, {
    locale?: "en" | "st" | "zu" | "xh";
}, {}>;
