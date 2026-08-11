export type LocalizedString = import('../runtime.js').LocalizedString;
export type Township_Popup_DistanceInputs = {};
/**
* | output |
* | --- |
* | "Distance" |
*
* @param {Township_Popup_DistanceInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const township_popup_distance: ((inputs?: Township_Popup_DistanceInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_DistanceInputs, {
    locale?: "en";
}, {}>;
