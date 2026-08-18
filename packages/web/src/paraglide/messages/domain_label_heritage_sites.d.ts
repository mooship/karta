export type LocalizedString = import('../runtime.js').LocalizedString;
export type Domain_Label_Heritage_SitesInputs = {};
/**
* | output |
* | --- |
* | "Heritage sites" |
*
* @param {Domain_Label_Heritage_SitesInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const domain_label_heritage_sites: ((inputs?: Domain_Label_Heritage_SitesInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Label_Heritage_SitesInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
