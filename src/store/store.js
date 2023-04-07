import {atom, selector} from 'recoil';

import {storage} from './storage';
import {cleanString} from '../utils/string';

const appState = atom({
  key: 'app',
  default: storage.getObject('app', {}),
  effects_UNSTABLE: [({onSet}) => onSet(app => storage.setObject('app', app))],
});

const chantsState = atom({
  key: 'chants',
  default: storage.getObject('chants', []),
  effects_UNSTABLE: [
    ({onSet}) => onSet(chants => storage.setObject('chants', chants)),
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

const chantsFilteredState = selector({
  key: 'chantsFiltered',
  get: ({get}) => {
    let chants = get(chantsState);
    const searchFilter = get(searchFilterState);
    const categoryFilter = get(categoryFilterState);
    const favorites = get(favoritesState);
    const favoriteFilter = get(favoriteFilterState);

    if (!searchFilter && !categoryFilter.length && !favoriteFilter) {
      return chants;
    }

    return chants.filter(chant => {
      const {id = '', categories = [], clean} = chant;

      if (favoriteFilter) {
        if (!favorites.includes(id)) {
          return false;
        }
      }
      if (categoryFilter.length) {
        if (!categories.some(c => categoryFilter.includes(c))) {
          return false;
        }
      }
      if (searchFilter) {
        const keyword = cleanString(searchFilter);
        if (!clean.title.includes(keyword) && !clean.chant.includes(keyword)) {
          return false;
        }
      }
      return true;
    });
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
