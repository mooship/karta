/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Spatial_Burden_LabelInputs */

const en_layer_spatial_burden_label = /** @type {(inputs: Layer_Spatial_Burden_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Combined spatial burden`)
};

const af_layer_spatial_burden_label = /** @type {(inputs: Layer_Spatial_Burden_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gekombineerde ruimtelike las`)
};

/**
* | output |
* | --- |
* | "Combined spatial burden" |
*
* @param {Layer_Spatial_Burden_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_spatial_burden_label = /** @type {((inputs?: Layer_Spatial_Burden_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Spatial_Burden_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_spatial_burden_label(inputs)
	return en_layer_spatial_burden_label(inputs)
});