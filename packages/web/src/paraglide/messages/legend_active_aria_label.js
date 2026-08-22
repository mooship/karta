/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Legend_Active_Aria_LabelInputs */

const en_legend_active_aria_label = /** @type {(inputs: Legend_Active_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Active map layers legend: ${i?.label}`)
};

const af_legend_active_aria_label = /** @type {(inputs: Legend_Active_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Aktiewe kaartlae-legende: ${i?.label}`)
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
export const legend_active_aria_label = /** @type {((inputs: Legend_Active_Aria_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_Active_Aria_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_legend_active_aria_label(inputs)
	return en_legend_active_aria_label(inputs)
});