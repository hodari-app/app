import React, {useMemo} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Button, List, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useRecoilValue} from 'recoil';

import {
  chantsFilteredState,
  chantsLoadingState,
  chantsState,
} from '../../store/store';
import {useLoadChants} from '../../hooks/loadChants';

const ITEM_HEIGHT = 47;

function Chants() {
  const navigation = useNavigation();
  const loadChants = useLoadChants();

  const chants = useRecoilValue(chantsState);
  const {error} = useRecoilValue(chantsLoadingState);
  const filtered = useRecoilValue(chantsFilteredState);

  const EmptyList = () =>
    useMemo(
      () => (
        <View style={styles.emptyList}>
          {chants.length ? (
            <Text>Aucun chant ne correspond à votre recherche</Text>
          ) : error ? (
            <>
              <Text>Une erreur est survenue durant le chargement</Text>
              <Button onPress={loadChants}>Réessayer</Button>
            </>
          ) : (
            <>
              <ActivityIndicator />
              <Text style={styles.downloadingText}>
                Téléchargement des chants...
              </Text>
            </>
          )}
        </View>
      ),
      [chants.length],
    );

  return (
    <FlatList
      data={filtered}
      renderItem={({item}) => (
        <List.Item
          style={{height: ITEM_HEIGHT}}
          onPress={() => navigation.navigate('Chant', {id: item.id})}
          title={item.title}
        />
      )}
      keyExtractor={item => item.id}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      keyboardShouldPersistTaps="always"
      ListEmptyComponent={EmptyList}
    />
  );
}

const styles = StyleSheet.create({
  emptyList: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 200,
  },
  downloadingText: {
    marginTop: 10,
  },
});

export default Chants;
