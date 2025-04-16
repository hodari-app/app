import React, {Fragment, useEffect, useState, useTransition} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import {useAtomValue} from 'jotai';
import diff from 'fast-diff';

import {chantsState} from '../../store/store';

function ChantDiff({navigation, route}) {
  const {id, edited} = route.params;
  const chants = useAtomValue(chantsState);
  const [chant, setChant] = useState({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    console.log('useEffect');
    startTransition(() => {
      console.log('startTransition');
      const found = chants.find(c => c.id === id);
      console.log({found});
      if (!found) {
        navigation.goBack();
        return;
      }
      setChant({...found, body: found.body.trim()});
    });
  }, [id]);

  const save = () => {};

  const headerRight = () => (
    <>
      <Appbar.Action icon="check" onPress={save} />
    </>
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [navigation]);

  if (pending || !chant?.body || !edited?.body) {
    return <Fragment />;
  }
  console.log(chant.body, edited.body);
  console.log(diff(chant.body, edited.body));

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}>
      <Fragment />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    height: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  titleInput: {
    paddingTop: 13,
  },
  input: {
    marginBottom: 20,
  },
  container: {
    paddingBottom: 80,
  },
});

export default ChantDiff;
