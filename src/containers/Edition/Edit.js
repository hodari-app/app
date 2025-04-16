import React, {Fragment, useEffect, useState, useTransition} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Appbar, TextInput} from 'react-native-paper';
import {useAtomValue} from 'jotai';

import {chantsState} from '../../store/store';

function Edit({navigation, route}) {
  const {id} = route.params;
  const chants = useAtomValue(chantsState);
  const [chant, setChant] = useState({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      const found = chants.find(c => c.id === id);
      if (!found) {
        navigation.goBack();
        return;
      }
      setChant({...found, body: found.body.trim()});
    });
  }, [id]);

  const save = () => {
    navigation.navigate('Diff', {id, edited: chant});
  };

  const headerRight = () => (
    <>
      <Appbar.Action icon="check" onPress={save} />
    </>
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [navigation, chant]);

  if (pending) {
    return <Fragment />;
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}>
      <TextInput
        mode="outlined"
        label="Titre"
        onChangeText={t => setChant({...chant, title: t.trim()})}
        value={chant.title}
        style={styles.input}
        contentStyle={styles.titleInput}
        multiline
      />
      <TextInput
        mode="outlined"
        label="Paroles"
        onChangeText={body => setChant({...chant, body})}
        value={chant.body}
        style={styles.input}
        multiline
      />
      <TextInput
        mode="outlined"
        label="URL vidéo YouTube"
        onChangeText={t => setChant({...chant, videoUrl: t.trim()})}
        value={chant.videoUrl}
        style={styles.input}
        multiline
      />
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

export default Edit;
