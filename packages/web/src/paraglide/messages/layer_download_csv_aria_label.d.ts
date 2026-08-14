export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Download_Csv_Aria_LabelInputs = {
    label: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Download {label} data (CSV)" |
*
* @param {Layer_Download_Csv_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_download_csv_aria_label: ((inputs: Layer_Download_Csv_Aria_LabelInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Download_Csv_Aria_LabelInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
