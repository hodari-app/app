import React from 'react';
import {StyleSheet} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {useRecoilValue, useRecoilState} from 'recoil';

import {chantsLoadingState, searchFilterState} from '../../store/store';

function SearchBar() {
  const [searchFilter, setSearchFilter] = useRecoilState(searchFilterState);
  const {loading} = useRecoilValue(chantsLoadingState);

  return (
    <Searchbar
      loading={loading}
      style={styles.searchBar}
      placeholder="Rechercher un chant..."
      onChangeText={setSearchFilter}
      clearIcon="close"
      onClearIconPress={() => setSearchFilter('')}
      value={searchFilter}
    />
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 10,
  },
});

export default SearchBar;
