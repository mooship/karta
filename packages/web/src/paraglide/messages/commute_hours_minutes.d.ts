export type LocalizedString = import('../runtime.js').LocalizedString;
export type Commute_Hours_MinutesInputs = {
    hours: NonNullable<unknown>;
    minutes: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "{hours}h {minutes}min" |
*
* @param {Commute_Hours_MinutesInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const commute_hours_minutes: ((inputs: Commute_Hours_MinutesInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_Hours_MinutesInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
