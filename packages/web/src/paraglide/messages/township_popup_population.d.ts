export type LocalizedString = import('../runtime.js').LocalizedString;
export type Township_Popup_PopulationInputs = {};
/**
* | output |
* | --- |
* | "Population" |
*
* @param {Township_Popup_PopulationInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const township_popup_population: ((inputs?: Township_Popup_PopulationInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_PopulationInputs, {
    locale?: "en" | "af";
}, {}>;
