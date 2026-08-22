export type LocalizedString = import('../runtime.js').LocalizedString;
export type Legend_Transit_RoutesInputs = {};
/**
* | output |
* | --- |
* | "Transit routes" |
*
* @param {Legend_Transit_RoutesInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const legend_transit_routes: ((inputs?: Legend_Transit_RoutesInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_Transit_RoutesInputs, {
    locale?: "en" | "af";
}, {}>;
