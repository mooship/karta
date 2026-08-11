export type LocalizedString = import('../runtime.js').LocalizedString;
export type Search_PlaceholderInputs = {};
/**
* | output |
* | --- |
* | "Search town, suburb or station" |
*
* @param {Search_PlaceholderInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const search_placeholder: ((inputs?: Search_PlaceholderInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_PlaceholderInputs, {
    locale?: "en";
}, {}>;
