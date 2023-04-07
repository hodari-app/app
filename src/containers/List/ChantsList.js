import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Searchbar, Text} from 'react-native-paper';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import {
  chantsFilteredState,
  chantsLoadingState,
  searchFilterState,
} from '../../store/store';
import Chants from './Chants';
import Filters from './Filters';

function ChantsList() {
  const setSearchFilter = useSetRecoilState(searchFilterState);
  const {loading} = useRecoilValue(chantsLoadingState);
  const chants = useRecoilValue(chantsFilteredState);

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
      <Filters />
      <View style={styles.actionBar}>
        <Text>{chants.length} chants</Text>
      </View>
      <Chants />
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
  actionBar: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default ChantsList;
