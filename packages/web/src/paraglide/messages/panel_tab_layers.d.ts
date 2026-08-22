export type LocalizedString = import('../runtime.js').LocalizedString;
export type Panel_Tab_LayersInputs = {};
/**
* | output |
* | --- |
* | "Layers" |
*
* @param {Panel_Tab_LayersInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const panel_tab_layers: ((inputs?: Panel_Tab_LayersInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_LayersInputs, {
    locale?: "en" | "af";
}, {}>;
