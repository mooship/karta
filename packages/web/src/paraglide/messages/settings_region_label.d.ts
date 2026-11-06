export type LocalizedString = import('../runtime.js').LocalizedString;
export type Settings_Region_LabelInputs = {};
/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{}} Settings_Region_LabelInputs */
/**
* | output |
* | --- |
* | "Settings" |
*
* @param {Settings_Region_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const settings_region_label: ((inputs?: Settings_Region_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Region_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
