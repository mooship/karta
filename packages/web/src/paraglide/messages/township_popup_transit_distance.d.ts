export type LocalizedString = import('../runtime.js').LocalizedString;
export type Township_Popup_Transit_DistanceInputs = {};
/**
* | output |
* | --- |
* | "Distance to nearest transit" |
*
* @param {Township_Popup_Transit_DistanceInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const township_popup_transit_distance: ((inputs?: Township_Popup_Transit_DistanceInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_Transit_DistanceInputs, {
    locale?: "en" | "af";
}, {}>;
