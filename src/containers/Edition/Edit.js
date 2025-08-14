import React, {
  Fragment,
  useEffect,
  useState,
  useTransition,
  useCallback,
} from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, TextInput } from 'react-native-paper';
import { useAtomValue } from 'jotai';

import { chantsState } from '../../store/store';

function Edit({ navigation, route }) {
  const { id } = route.params;
  const chants = useAtomValue(chantsState);
  const [original, setOriginal] = useState({});
  const [chant, setChant] = useState({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      const found = chants.find(c => c.id === id);
      if (!found) {
        navigation.goBack();
        return;
      }
      setOriginal({ ...found, body: found.body.trim() });
      setChant({ ...found, body: found.body.trim() });
    });
  }, [id, chants, navigation]);

  const save = useCallback(() => {
    navigation.navigate('Diff', { id, edited: chant });
  }, [navigation, id, chant]);

  const hasChanges =
    original.body !== chant.body ||
    original.title !== chant.title ||
    original.videoUrl !== chant.videoUrl;

  const headerRight = useCallback(
    () => (
      <>
        <Appbar.Action icon="check" onPress={save} disabled={!hasChanges} />
      </>
    ),
    [save, hasChanges],
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [navigation, headerRight]);

  if (pending) {
    return <Fragment />;
  }

  return (
    <SafeAreaView edges={['bottom', 'right', 'left']}>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollContainer}
          contentContainerStyle={styles.container}
        >
          <TextInput
            mode="outlined"
            label="Titre"
            onChangeText={t => setChant({ ...chant, title: t.trim() })}
            value={chant.title}
            style={styles.input}
            contentStyle={styles.titleInput}
            scrollEnabled={false}
            multiline
          />
          <TextInput
            mode="outlined"
            label="Paroles"
            onChangeText={body => setChant({ ...chant, body })}
            value={chant.body}
            style={styles.input}
            scrollEnabled={false}
            multiline
          />
          <TextInput
            mode="outlined"
            label="URL vidéo YouTube"
            onChangeText={t => setChant({ ...chant, videoUrl: t.trim() })}
            value={chant.videoUrl}
            style={styles.input}
            scrollEnabled={false}
            multiline
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    height: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  titleInput: {
    paddingTop: 13,
  },
  input: {
    marginBottom: 20,
  },
  container: {
    paddingBottom: 200,
  },
});

export default Edit;
