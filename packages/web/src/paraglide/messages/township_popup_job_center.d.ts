export type LocalizedString = import('../runtime.js').LocalizedString;
export type Township_Popup_Job_CenterInputs = {};
/**
* | output |
* | --- |
* | "Nearest job centre" |
*
* @param {Township_Popup_Job_CenterInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const township_popup_job_center: ((inputs?: Township_Popup_Job_CenterInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_Job_CenterInputs, {
    locale?: "en" | "af";
}, {}>;
