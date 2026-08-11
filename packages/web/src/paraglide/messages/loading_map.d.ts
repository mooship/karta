export type LocalizedString = import('../runtime.js').LocalizedString;
export type Loading_MapInputs = {};
/**
* | output |
* | --- |
* | "Loading map" |
*
* @param {Loading_MapInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const loading_map: ((inputs?: Loading_MapInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Loading_MapInputs, {
    locale?: "en";
}, {}>;
