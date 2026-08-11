export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Download_Aria_LabelInputs = {
    label: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Download {label} data (GeoJSON)" |
*
* @param {Layer_Download_Aria_LabelInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const layer_download_aria_label: ((inputs: Layer_Download_Aria_LabelInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Download_Aria_LabelInputs, {
    locale?: "en";
}, {}>;
