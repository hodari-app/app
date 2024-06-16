import {atom, selector} from 'recoil';
import * as Sentry from '@sentry/react-native';

import {storage} from './storage';
import {cleanString} from '../utils/string';
import * as schema from './schema';
import {db} from './database';

const appState = atom({
  key: 'app',
  default: storage.getObject('app', {}),
  effects_UNSTABLE: [({onSet}) => onSet(app => storage.setObject('app', app))],
});

const loadChants = selector({
  key: 'loadChantsFromDB',
  get: () => db.select().from(schema.chants),
});

const chantsState = atom({
  key: 'chants',
  default: loadChants,
  effects_UNSTABLE: [
    ({onSet}) =>
      onSet(async chants => {
        try {
          await db.delete(schema.chants);
          await db.insert(schema.chants).values(chants);
        } catch (e) {
          Sentry.captureException(e);
        }
      }),
  ],
});

const chantsLoadingState = atom({
  key: 'chantsLoading',
  default: {loading: false, error: false},
});

const favoritesState = atom({
  key: 'favorites',
  default: storage.getObject('favorites', []),
  effects_UNSTABLE: [
    ({onSet}) => onSet(favorites => storage.setObject('favorites', favorites)),
  ],
});

const categoriesState = selector({
  key: 'categories',
  get: ({get}) => {
    const categories = {};

    const chants = get(chantsFilteredState);
    for (const chant of chants) {
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
  },
});

const searchFilterState = atom({
  key: 'searchFilter',
  default: '',
});

const categoryFilterState = atom({
  key: 'categoryFilter',
  default: [],
});

const favoriteFilterState = atom({
  key: 'favoriteFilter',
  default: false,
});

const chantsCleanedState = selector({
  key: 'chantsCleanedState',
  get: ({get}) => {
    const chants = get(chantsState);
    return chants.map(chant => ({
      ...chant,
      clean: {
        title: cleanString(chant.title),
        body: cleanString(chant.body),
      },
    }));
  },
});

const chantsFilteredState = selector({
  key: 'chantsFiltered',
  get: ({get}) => {
    let chants = get(chantsCleanedState);
    const searchFilter = get(searchFilterState);
    const categoryFilter = get(categoryFilterState);
    const favorites = get(favoritesState);
    const favoriteFilter = get(favoriteFilterState);

    if (searchFilter.length < 3 && !categoryFilter.length && !favoriteFilter) {
      return chants;
    }

    const title = [],
      body = [];
    for (const chant of chants) {
      const {id = '', categories = [], clean} = chant;

      if (favoriteFilter && favorites.includes(id)) {
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
  },
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
