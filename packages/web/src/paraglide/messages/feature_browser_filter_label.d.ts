export type LocalizedString = import('../runtime.js').LocalizedString;
export type Feature_Browser_Filter_LabelInputs = {};
/**
* | output |
* | --- |
* | "Filter features" |
*
* @param {Feature_Browser_Filter_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const feature_browser_filter_label: ((inputs?: Feature_Browser_Filter_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Feature_Browser_Filter_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
