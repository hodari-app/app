import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, List, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAtomValue } from 'jotai';
import { FlashList } from '@shopify/flash-list';

import {
  chantsFilteredState,
  chantsLoadingState,
  chantsState,
  listModeState,
} from '../../store/store';
import { useLoadChants } from '../../hooks/loadChants';
import Empty from './Empty';

const ITEM_HEIGHT = 47;

function Chants() {
  const navigation = useNavigation();
  const loadChants = useLoadChants();
  const listMode = useAtomValue(listModeState);
  const { error } = useAtomValue(chantsLoadingState);
  const chants = useAtomValue(chantsState);
  const displayedChants = useAtomValue(chantsFilteredState);

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
            {listMode === 'favorites'
              ? 'Aucun chant en favoris'
              : 'Aucun chant récent'}
          </Text>
        </Empty>
      );
    }, [error, listMode, chants]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {listMode === 'all' && (
        <View style={styles.actionBar}>
          <Text>{displayedChants.length} chants</Text>
        </View>
      )}
      <FlashList
        data={displayedChants}
        renderItem={({ item }) => (
          <List.Item
            style={{ height: ITEM_HEIGHT }}
            onPress={() => navigation.navigate('Chant', { id: item.id })}
            title={item.title}
          />
        )}
        keyExtractor={item => item.id}
        estimatedItemSize={ITEM_HEIGHT}
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
});

export default Chants;
