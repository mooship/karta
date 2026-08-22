export type LocalizedString = import('../runtime.js').LocalizedString;
export type Township_Popup_Car_TimeInputs = {};
/**
* | output |
* | --- |
* | "Modelled car time" |
*
* @param {Township_Popup_Car_TimeInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const township_popup_car_time: ((inputs?: Township_Popup_Car_TimeInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_Car_TimeInputs, {
    locale?: "en" | "af";
}, {}>;
