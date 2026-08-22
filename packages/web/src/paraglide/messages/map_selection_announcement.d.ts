export type LocalizedString = import('../runtime.js').LocalizedString;
export type Map_Selection_AnnouncementInputs = {
    label: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "{label} selected" |
*
* @param {Map_Selection_AnnouncementInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const map_selection_announcement: ((inputs: Map_Selection_AnnouncementInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Map_Selection_AnnouncementInputs, {
    locale?: "en" | "af";
}, {}>;
