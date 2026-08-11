export type LocalizedString = import('../runtime.js').LocalizedString;
export type RetryInputs = {};
/**
* | output |
* | --- |
* | "Retry" |
*
* @param {RetryInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const retry: ((inputs?: RetryInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<RetryInputs, {
    locale?: "en";
}, {}>;
