import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Searchbar, Text } from 'react-native-paper';
import { useAtom, useAtomValue } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import {
  chantsLoadingState,
  chantsSearchFilteredState,
  searchFilterState,
} from '../store/store';
import Empty from './List/Empty';

function Search() {
  const ref = useRef(null);
  const navigation = useNavigation();
  const [searchFilter, setSearchFilter] = useAtom(searchFilterState);
  const { loading } = useAtomValue(chantsLoadingState);
  const filtered = useAtomValue(chantsSearchFilteredState);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const EmptyList = () =>
    useMemo(
      () => (
        <Empty>
          <Text>
            {searchFilter.length
              ? 'Aucun chant ne correspond à votre recherche'
              : ''}
          </Text>
        </Empty>
      ),
      [],
    );

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        ref={ref}
        icon="arrow-left"
        onIconPress={() => {
          setSearchFilter('');
          navigation.goBack();
        }}
        loading={loading}
        style={styles.searchBar}
        placeholder="Rechercher un chant..."
        onChangeText={setSearchFilter}
        clearIcon="close"
        onClearIconPress={() => setSearchFilter('')}
        value={searchFilter}
      />
      <FlashList
        data={filtered}
        renderItem={({ item }) => (
          <List.Item
            style={styles.item}
            onPress={() => navigation.navigate('Chant', { id: item.id })}
            title={item.title}
          />
        )}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="always"
        ListEmptyComponent={EmptyList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 10,
  },
  results: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 1000,
  },
  item: {
    height: 50,
  },
});

export default Search;
