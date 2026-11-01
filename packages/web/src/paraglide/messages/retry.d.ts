export type LocalizedString = import('../runtime.js').LocalizedString;
export type RetryInputs = {};
/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{}} RetryInputs */
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
