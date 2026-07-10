import ptBR from "./pt-BR.json";
import en from "./en.json";

export type Locale = "pt-BR" | "en";

type Translations = Record<string, unknown>;

const dictionaries: Record<Locale, Translations> = {
  "pt-BR": ptBR as unknown as Translations,
  en: en as unknown as Translations,
};

function deepGet(obj: Translations, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  if (typeof current !== "string") return undefined;
  return current;
}

export function getTranslations(locale: Locale) {
  return (key: string, params?: Record<string, string | number>) => {
    const dict = dictionaries[locale];
    let value = deepGet(dict, key);

    if (value === undefined) {
      const fallback = deepGet(dictionaries["pt-BR"], key);
      if (fallback !== undefined) value = fallback;
    }

    if (value === undefined) return key;

    if (params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        return acc.replace(`{${k}}`, String(v));
      }, value);
    }

    return value;
  };
}

export function getDictionary(locale: Locale): Translations {
  return dictionaries[locale] || dictionaries["pt-BR"];
}

export { dictionaries, deepGet };
