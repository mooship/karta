export type LocalizedString = import('../runtime.js').LocalizedString;
export type Commute_MinutesInputs = {
    minutes: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "{minutes} min" |
*
* @param {Commute_MinutesInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const commute_minutes: ((inputs: Commute_MinutesInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_MinutesInputs, {
    locale?: "en";
}, {}>;
