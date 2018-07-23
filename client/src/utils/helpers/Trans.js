import translations from 'src/utils/translations.json';

const {defaultLang} = translations;
let usingLang = 'vi';
let langDict = {};

export default class Trans {
    static setLang(lang: string) {
        usingLang = lang;
        const {translated} = translations;
        if (lang != defaultLang) {
            for (let translation of translated) {
                langDict[translation[defaultLang]] = translation[lang];
            }
        }
    }

    static trans(key: string): string {
        if (usingLang == defaultLang) return key;
        return langDict[key];
    }
}
