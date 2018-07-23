// @flow

let translations = {};
let defaultLang = 'vi';
let usingLang = 'vi';
let langDict = {};

export default class Trans {
    static initTranslations(translationSource: Object) {
        translations = translationSource;
        defaultLang = translations.defaultLang;
        this.setLang(defaultLang);
    }

    static setLang(lang: string) {
        if (!lang) {
            usingLang = defaultLang;
        } else {
            usingLang = lang;
        }
        const {translated} = translations;
        if (lang != defaultLang) {
            for (let translation of translated) {
                langDict[translation[defaultLang]] = translation[lang];
            }
        }
    }

    // $FlowFixMe: do not complain about missing arguments annotation
    static trans(key: string, ...values): string {
        const delimiter = '{{}}';
        let trans = usingLang == defaultLang ? key : langDict[key];
        if (!trans) return key;
        for (let value of values) {
            trans = trans.replace(delimiter, value);
        }
        const re = new RegExp(delimiter, 'g');
        trans = trans.replace(re, '');
        return trans;
    }
}
