export type LocalizedString = import('../runtime.js').LocalizedString;
export type Legend_Active_Aria_LabelInputs = {
    label: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Active map layers legend: {label}" |
*
* @param {Legend_Active_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const legend_active_aria_label: ((inputs: Legend_Active_Aria_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_Active_Aria_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
