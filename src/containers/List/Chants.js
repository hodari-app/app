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
  const chants = useAtomValue(chantsState);
  const { error } = useAtomValue(chantsLoadingState);
  const filtered = useAtomValue(chantsFilteredState);

  const EmptyList = () =>
    useMemo(
      () => (
        <Empty>
          {chants.length && !filtered.length ? (
            listMode === 'all' ? (
              <Text>Aucun chant ne correspond à votre recherche</Text>
            ) : listMode === 'favorites' ? (
              <Text>Aucun chant en favoris</Text>
            ) : (
              <Text>Aucun chant récent</Text>
            )
          ) : error ? (
            <>
              <Text>Une erreur est survenue durant le chargement</Text>
              <Button onPress={loadChants}>Réessayer</Button>
            </>
          ) : (
            <Text style={styles.downloadingText}>Chargement des chants...</Text>
          )}
        </Empty>
      ),
      [filtered], // eslint-disable-line react-hooks/exhaustive-deps
    );

  return (
    <>
      {listMode === 'all' && (
        <View style={styles.actionBar}>
          <Text>{filtered.length} chants</Text>
        </View>
      )}
      <FlashList
        data={filtered}
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
