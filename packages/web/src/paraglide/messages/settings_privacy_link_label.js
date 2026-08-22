/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Privacy_Link_LabelInputs */

const en_settings_privacy_link_label = /** @type {(inputs: Settings_Privacy_Link_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Privacy policy`)
};

const af_settings_privacy_link_label = /** @type {(inputs: Settings_Privacy_Link_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Privaatheidsbeleid`)
};

/**
* | output |
* | --- |
* | "Privacy policy" |
*
* @param {Settings_Privacy_Link_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const settings_privacy_link_label = /** @type {((inputs?: Settings_Privacy_Link_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Privacy_Link_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_settings_privacy_link_label(inputs)
	return en_settings_privacy_link_label(inputs)
});