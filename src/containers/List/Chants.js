import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, List, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAtomValue } from 'jotai';
import { FlashList } from '@shopify/flash-list';

import {
  allChantsState,
  chantsLoadingState,
  chantsState,
  favoritesChants,
  recentsChants,
} from '../../store/store';
import { useLoadChants } from '../../hooks/loadChants';
import Empty from './Empty';
import Filters from './Filters';

function Chants({ mode }) {
  const navigation = useNavigation();
  const loadChants = useLoadChants();
  const { error } = useAtomValue(chantsLoadingState);
  const chants = useAtomValue(chantsState);
  const displayedChants = useAtomValue(
    {
      all: allChantsState,
      favorites: favoritesChants,
      recent: recentsChants,
    }[mode],
  );

  const EmptyList = () =>
    useMemo(() => {
      if (error) {
        return (
          <Empty>
            <Text>Une erreur est survenue durant le chargement</Text>
            <Button onPress={loadChants}>Réessayer</Button>
          </Empty>
        );
      }
      if (!chants.length) {
        return (
          <Empty>
            <Text style={styles.downloadingText}>Chargement des chants...</Text>
          </Empty>
        );
      }
      return (
        <Empty>
          <Text>
            {mode === 'favorites'
              ? 'Aucun chant en favoris'
              : 'Aucun chant récent'}
          </Text>
        </Empty>
      );
    }, [error, mode, chants]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderItem = useCallback(
    ({ item }) => (
      <List.Item
        style={styles.item}
        onPress={() => navigation.navigate('Chant', { id: item.id })}
        title={item.title}
      />
    ),
    [navigation],
  );

  return (
    <>
      {mode === 'all' && (
        <>
          <Filters />
          <View style={styles.actionBar}>
            <Text>{displayedChants.length} chants</Text>
          </View>
        </>
      )}
      <FlashList
        data={displayedChants}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="always"
        ListEmptyComponent={EmptyList}
      />
    </>
  );
}

const styles = StyleSheet.create({
  downloadingText: {
    marginTop: 10,
  },
  actionBar: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  item: {
    height: 50,
  },
});

export default Chants;
