/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Label_Heritage_SitesInputs */

const en_domain_label_heritage_sites = /** @type {(inputs: Domain_Label_Heritage_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heritage sites`)
};

const st_domain_label_heritage_sites = /** @type {(inputs: Domain_Label_Heritage_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mafelo a bohwa`)
};

const zu_domain_label_heritage_sites = /** @type {(inputs: Domain_Label_Heritage_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Izindawo zefa`)
};

const xh_domain_label_heritage_sites = /** @type {(inputs: Domain_Label_Heritage_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iindawo zelifa`)
};

const af_domain_label_heritage_sites = /** @type {(inputs: Domain_Label_Heritage_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Erfenisplekke`)
};

/**
* | output |
* | --- |
* | "Heritage sites" |
*
* @param {Domain_Label_Heritage_SitesInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const domain_label_heritage_sites = /** @type {((inputs?: Domain_Label_Heritage_SitesInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Label_Heritage_SitesInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_domain_label_heritage_sites(inputs)
	if (locale === "zu") return zu_domain_label_heritage_sites(inputs)
	if (locale === "xh") return xh_domain_label_heritage_sites(inputs)
	if (locale === "af") return af_domain_label_heritage_sites(inputs)
	return en_domain_label_heritage_sites(inputs)
});