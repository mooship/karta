export type LocalizedString = import('../runtime.js').LocalizedString;
export type RetryInputs = {};
/**
* | output |
* | --- |
* | "Retry" |
*
* @param {RetryInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const retry: ((inputs?: RetryInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<RetryInputs, {
    locale?: "en" | "af";
}, {}>;
