const regexs = [
  [/[àáâãäå]/g, 'a'],
  [/[èéêë]/g, 'e'],
  [/[ìíîï]/g, 'i'],
  [/[òóôõöő]/g, 'o'],
  [/[ùúûüű]/g, 'u'],
  [/[ýŷÿ]/g, 'y'],
  [/ñ/g, 'n'],
  [/[çc]/g, 'c'],
];

function cleanString(str) {
  str = str.toLowerCase().trim();
  for (const [regex, target] of regexs) {
    str = str.replace(regex, target);
  }
  return str;
}

export {cleanString};
