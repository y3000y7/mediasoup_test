const list = [
  {
    name: "한국어",
    file: "en",
    locale: ["en", "en-en"]
  }
];

export const detect = () => {
  const localeFull = (
    navigator.language || navigator.browserLanguage
  ).toLowerCase();

  // const localeCountry = localeFull.split(/[-_]/)[0];

  // const localeRegion = localeFull.split(/[-_]/)[1] || null;

  return localeFull;
};

export const getList = () => list;

export const loadOne = locale => {
  let res = {};

  try {
    res = list.filter(
      item =>
        item.locale.includes(locale) ||
        item.locale.includes(locale.split(/[-_]/)[0])
    )[0];

    res.messages = require(`./${res.file}`);
  } catch {
    res = list.filter(item => item.locale.includes("en"))[0];

    res.messages = require(`./${res.file}`);
  }

  return res;
};
