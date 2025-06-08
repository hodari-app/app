import {atom} from 'jotai';

import {storage} from './storage';
import {cleanString} from '../utils/string';
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

const chantsLoadingState = atom({loading: false, error: false});

const favorites = atom(storage.getObject('favorites', []));
const favoritesState = atom(
  get => get(favorites),
  (get, set, update) => {
    set(favorites, update);
    storage.setObject('favorites', update);
  },
);

const categoriesState = atom(get => {
  const filteredChants = get(chantsFilteredState);
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
    .map(name => ({name, count: categories[name]}));
});

const searchFilterState = atom('');

const categoryFilterState = atom([]);

const favoriteFilterState = atom(false);

const chantsCleanedState = atom(get => {
  return get(chantsState).map(chant => ({
    ...chant,
    clean: {
      title: cleanString(chant.title),
      body: cleanString(chant.body),
    },
  }));
});

const chantsFilteredState = atom(get => {
  const cleanedChants = get(chantsCleanedState);
  const searchFilter = get(searchFilterState);
  const categoryFilter = get(categoryFilterState);
  const favoriteState = get(favoritesState);
  const favoriteFilter = get(favoriteFilterState);

  if (searchFilter.length < 3 && !categoryFilter.length && !favoriteFilter) {
    return chants;
  }

  const title = [],
    body = [];
  for (const chant of cleanedChants) {
    const {id = '', categories = [], clean} = chant;

    if (favoriteFilter && favoriteState.includes(id)) {
      title.push(chant);
    }
    if (
      categoryFilter.length &&
      categories.some(c => categoryFilter.includes(c))
    ) {
      title.push(chant);
    }
    if (searchFilter) {
      const keyword = cleanString(searchFilter);
      if (clean.title.includes(keyword)) {
        title.push(chant);
      } else if (clean.body.includes(keyword)) {
        body.push(chant);
      }
    }
  }

  return title.concat(body);
});

export {
  appState,
  chantsState,
  chantsLoadingState,
  favoritesState,
  categoriesState,
  searchFilterState,
  categoryFilterState,
  chantsFilteredState,
  favoriteFilterState,
};
