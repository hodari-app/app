import React, {Suspense} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Searchbar, Text} from 'react-native-paper';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {chantsLoadingState, searchFilterState} from '../../store/store';
import Chants from './Chants';
import Filters from './Filters';
import Empty from './Empty';

function ChantsList() {
  const setSearchFilter = useSetRecoilState(searchFilterState);
  const {loading} = useRecoilValue(chantsLoadingState);

  const fallback = (
    <Empty>
      <Text>Chargement...</Text>
    </Empty>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        loading={loading}
        style={styles.searchBar}
        placeholder="Rechercher un chant..."
        onChangeText={setSearchFilter}
        clearIcon="close"
        onClearIconPress={() => setSearchFilter('')}
      />
      <Suspense fallback={fallback}>
        <Filters />
        <Chants />
      </Suspense>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight + 10,
  },
  searchBar: {
    marginHorizontal: 10,
  },
});

export default ChantsList;
