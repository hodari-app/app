import React, {Suspense} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

import SearchBar from './SearchBar';
import Chants from './Chants';
import Filters from './Filters';
import Empty from './Empty';

function ChantsList() {
  const fallback = (
    <Empty>
      <Text>Chargement...</Text>
    </Empty>
  );

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
