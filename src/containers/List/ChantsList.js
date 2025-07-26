import React, {Suspense, useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {useSetAtom} from 'jotai';
import {useIsFocused} from '@react-navigation/native';

import SearchBar from './SearchBar';
import Chants from './Chants';
import Filters from './Filters';
import Empty from './Empty';
import {currentChantState} from '../../store/store';

function ChantsList() {
  const setCurrentChant = useSetAtom(currentChantState);
  const isFocused = useIsFocused();

  const fallback = (
    <Empty>
      <Text>Chargement...</Text>
    </Empty>
  );

  useEffect(() => {
    if (isFocused) {
      setCurrentChant(null);
    }
  }, [isFocused, setCurrentChant]);

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar />
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
});

export default ChantsList;
