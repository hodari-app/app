import { atom } from 'jotai';

import { storage } from './storage';
import { cleanString } from '../utils/string';
import * as db from './database';

const app = atom(storage.getObject('app', {}));
const appState = atom(
  get => get(app),
  (get, set, update) => {
    set(app, update);
    storage.setObject('app', update);
  },
);

const chants = atom([]);
const chantsState = atom(
  get => get(chants),
  (get, set, update) => {
    set(chants, update);
    db.setChants(update);
  },
);

const recentsStorage = storage.getObject('recents', []);
const recents = atom(recentsStorage);
const recentsState = atom(
  get => get(recents),
  (get, set, update) => {
    set(recents, update);
    storage.setObject('recents', update);
  },
);
const recentsChants = atom(get => {
  const ids = get(recentsState);
  if (!ids.length) {
    return [];
  }
  const indexById = new Map(ids.map((id, index) => [id, index]));
  const ordered = new Array(ids.length);
  for (const chant of get(chantsState)) {
    const pos = indexById.get(chant.id);
    if (pos !== undefined) {
      ordered[pos] = chant;
    }
  }
  return ordered.filter(Boolean);
});

const chantsLoadingState = atom({ loading: false, error: false });

const favorites = atom(storage.getObject('favorites', []));
const favoritesState = atom(
  get => get(favorites),
  (get, set, update) => {
    set(favorites, update);
    storage.setObject('favorites', update);
  },
);
const favoritesChants = atom(get => {
  const favorites = get(favoritesState);
  return get(chantsState).filter(chant => favorites.includes(chant.id));
});

const searchFilterState = atom('');
const categoryFilterState = atom([]);

const chantsCleanedState = atom(get => {
  return get(chantsState).map(chant => ({
    ...chant,
    clean: {
      title: cleanString(chant.title),
      body: cleanString(chant.body),
    },
  }));
});

const categoriesState = atom(get => {
  const filteredChants = get(allChantsState);
  const categories = {};

  for (const chant of filteredChants) {
    if (!chant.categories) {
      continue;
    }
    for (const category of chant.categories) {
      if (categories[category]) {
        categories[category]++;
      } else {
        categories[category] = 1;
      }
    }
  }

  return Object.keys(categories)
    .sort((a, b) => categories[b] - categories[a])
    .map(name => ({ name, count: categories[name] }));
});

const allChantsState = atom(get => {
  const allChants = get(chantsCleanedState);

  const categoryFilter = get(categoryFilterState);
  if (!categoryFilter.length) {
    return allChants;
  }

  const title = [];
  const body = [];
  for (const chant of allChants) {
    const { categories = [] } = chant;

    if (
      categoryFilter.length &&
      categories.some(c => categoryFilter.includes(c))
    ) {
      title.push(chant);
    }
  }

  return title.concat(body);
});

const chantsSearchFilteredState = atom(get => {
  const searchFilter = get(searchFilterState);
  if (!searchFilter) {
    return [];
  }

  const title = [];
  const body = [];
  for (const chant of get(chantsCleanedState)) {
    const { clean } = chant;

    const keyword = cleanString(searchFilter);
    if (clean.title.includes(keyword)) {
      title.push(chant);
      continue;
    }
    if (clean.body.includes(keyword)) {
      body.push(chant);
    }
  }

  return title.concat(body);
});

export {
  appState,
  chantsState,
  chantsLoadingState,
  allChantsState,
  favoritesState,
  favoritesChants,
  recentsState,
  recentsChants,
  categoriesState,
  searchFilterState,
  categoryFilterState,
  chantsSearchFilteredState,
};
