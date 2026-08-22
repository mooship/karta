export type LocalizedString = import('../runtime.js').LocalizedString;
export type Feature_Browser_Filter_PlaceholderInputs = {};
/**
* | output |
* | --- |
* | "Search by name" |
*
* @param {Feature_Browser_Filter_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const feature_browser_filter_placeholder: ((inputs?: Feature_Browser_Filter_PlaceholderInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Feature_Browser_Filter_PlaceholderInputs, {
    locale?: "en" | "af";
}, {}>;
