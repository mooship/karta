/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Switcher_LabelInputs */

const en_domain_switcher_label = /** @type {(inputs: Domain_Switcher_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a map`)
};

const st_domain_switcher_label = /** @type {(inputs: Domain_Switcher_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kgetha 'mapa`)
};

const zu_domain_switcher_label = /** @type {(inputs: Domain_Switcher_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Khetha ibalazwe`)
};

const xh_domain_switcher_label = /** @type {(inputs: Domain_Switcher_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Khetha imephu`)
};

const af_domain_switcher_label = /** @type {(inputs: Domain_Switcher_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kies 'n kaart`)
};

/**
* | output |
* | --- |
* | "Choose a map" |
*
* @param {Domain_Switcher_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const domain_switcher_label = /** @type {((inputs?: Domain_Switcher_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Switcher_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_domain_switcher_label(inputs)
	if (locale === "zu") return zu_domain_switcher_label(inputs)
	if (locale === "xh") return xh_domain_switcher_label(inputs)
	if (locale === "af") return af_domain_switcher_label(inputs)
	return en_domain_switcher_label(inputs)
});