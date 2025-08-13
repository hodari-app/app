import React, { startTransition, Suspense } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation, Icon, Searchbar, Text } from 'react-native-paper';
import { useAtom } from 'jotai';
import { useNavigation } from '@react-navigation/native';

import { listModeState } from '../store/store';
import Chants from './List/Chants';
import Filters from './List/Filters';
import Empty from './List/Empty';

function List() {
  const navigation = useNavigation();
  const [listMode, setListMode] = useAtom(listModeState);
  const routes = [
    { key: 'all', title: 'Tous', icon: 'music' },
    { key: 'recent', title: 'Récents', icon: 'history' },
    { key: 'favorites', title: 'Favoris', icon: 'heart' },
  ];

  const fallback = (
    <Empty>
      <Text>Chargement...</Text>
    </Empty>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <Searchbar
        icon="music"
        style={styles.searchBar}
        placeholder="Rechercher un chant..."
        onPress={() => navigation.navigate('Search')}
        disabled
      />
      <Suspense fallback={fallback}>
        {listMode === 'all' && <Filters />}
        <Chants />
      </Suspense>
      <BottomNavigation.Bar
        navigationState={{
          index: routes.findIndex(r => r.key === listMode),
          routes,
        }}
        onTabPress={({ route }) => {
          startTransition(() => {
            setListMode(route.key);
          });
        }}
        renderIcon={({ route, color }) => (
          <Icon source={route.icon} size={24} color={color} />
        )}
        getLabelText={({ route }) => route.title}
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
});

export default List;
