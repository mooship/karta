/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Legend_Active_Aria_LabelInputs */



/**
* | output |
* | --- |
* | "Active map layers legend: {label}" |
*
* @param {Legend_Active_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const legend_active_aria_label = /** @type {((inputs: Legend_Active_Aria_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_Active_Aria_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`Aktiewe kaartlae-legende: ${i?.label}`)
	return /** @type {LocalizedString} */ (`Active map layers legend: ${i?.label}`)
});