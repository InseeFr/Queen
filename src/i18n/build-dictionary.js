import dictionary from './dictionary';

/**
 * Based on the locale passed as a paremeter, this function will return
 * the corresponding dictionary.
 *
 * @param {string} lang the lang of the user
 */
export const createDictionary = lang =>
  Object.keys(dictionary).reduce((_, k) => {
    _[k] = dictionary[k][lang];
    return _;
  }, {});

/**
 * This function will return only the lang part of a locale
 * For example, with fr-FR, will return fr
 * If the lang is not fr, will return en
 * @param {string} lang the lang of the user
 */
export const getLang = defaultLang =>
  (defaultLang || navigator.language || navigator.browserLanguage).split('-')[0] === 'fr'
    ? 'fr'
    : 'en';

export default createDictionary(getLang());
