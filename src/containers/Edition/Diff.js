import React, {
  Fragment,
  useEffect,
  useState,
  useTransition,
  useCallback,
} from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Text } from 'react-native-paper';
import { useAtomValue } from 'jotai';
import { diffJson } from 'diff';
import Markdown, { MarkdownIt } from '@ronradtke/react-native-markdown-display';

import { chantsState } from '../../store/store';
import { editChant } from '../../api/chants';
import pluginIns from '../../plugins/markdown-it-ins';
import pluginDel from '../../plugins/markdown-it-del';

const markdownItInstance = new MarkdownIt({ typographer: true })
  .use(pluginIns, {
    containerClassName: 'ins',
  })
  .use(pluginDel, {
    containerClassName: 'del',
  });

function ChantDiff({ navigation, route }) {
  const { id, edited } = route.params;
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
      setChant({ ...found, body: found.body.trim() });
    });
  }, [id, chants, navigation]);

  const save = useCallback(() => {
    Alert.alert(
      "Confirmer l'édition",
      'Êtes-vous sûr de vouloir enregistrer ces modifications ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Confirmer',
          onPress: async () => {
            console.log(await editChant(edited));
            navigation.popTo('Chant', { id });
          },
        },
      ],
    );
  }, [edited, navigation, id]);

  const headerRight = useCallback(
    () => <Appbar.Action icon="check" onPress={save} />,
    [save],
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [navigation, headerRight]);

  if (pending || !chant?.body || !edited?.body) {
    return <Fragment />;
  }

  const hunksBody = diffJson(chant.body, edited.body);
  const titleChanged = edited.title !== chant.title;
  const videoChanged = edited.videoUrl !== chant.videoUrl;

  const ins = (node, children) => (
    <Text key={node.key} style={styles.added}>
      {children}
    </Text>
  );

  const del = (node, children) => (
    <Text key={node.key} style={styles.removed}>
      {children}
    </Text>
  );

  return (
    <SafeAreaView>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
      >
        <View style={styles.title}>
          {titleChanged ? (
            <Text variant="headlineSmall" style={styles.removed}>
              {chant.title}
            </Text>
          ) : null}
          <Text variant="headlineSmall" style={titleChanged && styles.added}>
            {edited.title}
          </Text>
        </View>
        <Markdown
          markdownit={markdownItInstance}
          style={{ body: styles.body }}
          rules={{ ins, del }}
        >
          {hunksBody
            .map(hunk => {
              if (!hunk.added && !hunk.removed) {
                return hunk.value;
              }
              return `${hunk.added ? '++' : '--'}${hunk.value.trim()}${
                hunk.added ? '++' : '--'
              }\n`;
            })
            .join('')}
        </Markdown>
        <View style={styles.video}>
          {videoChanged && chant.videoUrl ? (
            <Text variant="titleMedium" style={styles.removed}>
              {chant.videoUrl}
            </Text>
          ) : null}
          <Text variant="titleMedium" style={videoChanged && styles.added}>
            {edited.videoUrl}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    height: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  container: {
    paddingBottom: 80,
  },
  title: {
    marginBottom: 10,
  },
  added: {
    backgroundColor: '#e6ffe6',
    color: '#22863a',
  },
  removed: {
    backgroundColor: '#ffe6e6',
    color: '#cb2431',
  },
  body: {
    fontSize: 18,
    lineHeight: 20,
  },
  video: {
    marginTop: 10,
  },
});

export default ChantDiff;
