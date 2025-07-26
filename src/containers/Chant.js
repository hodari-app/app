import React, {Fragment, useEffect, useState, useTransition} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Markdown from '@ronradtke/react-native-markdown-display';
import {Appbar, Text, useTheme} from 'react-native-paper';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';

import {chantsState, currentChantState, favoritesState} from '../store/store';

function Chant({navigation, route}) {
  const {id} = route.params;
  const theme = useTheme();
  const chants = useAtomValue(chantsState);
  const setCurrentChant = useSetAtom(currentChantState);
  const [chant, setChant] = useState();
  const [pending, startTransition] = useTransition();
  const [favorites, setFavorites] = useAtom(favoritesState);
  const [fontSize, setFontSize] = useState(18);

  const {body, ...metadata} = chant || {body: ''};
  const isFavorite = favorites.includes(id);

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(favoriteId => favoriteId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const headerRight = () => (
    <>
      <Appbar.Action
        icon="format-font-size-decrease"
        onPress={() => setFontSize(c => c - 1)}
      />
      <Appbar.Action
        icon="format-font-size-increase"
        onPress={() => setFontSize(c => c + 1)}
      />
      <Appbar.Action
        icon="pencil"
        onPress={() => navigation.navigate('Edit', {id})}
      />
      <Appbar.Action
        icon={isFavorite ? 'heart' : 'heart-outline'}
        color={theme.colors.error}
        onPress={toggleFavorite}
      />
    </>
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [navigation, favorites]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    startTransition(() => {
      if (!chants.length) {
        return;
      }
      const currentChant = chants.find(c => c.id === id);
      if (!currentChant) {
        navigation.navigate('TabNavigator');
      }
      setChant(currentChant);
      setCurrentChant(currentChant.id);
    });
  }, [id, chants, navigation, setCurrentChant]);

  if (pending) {
    return <Fragment />;
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        {metadata.title}
      </Text>
      {body ? (
        <Markdown
          style={{
            body: {color: theme.colors.onSurface, fontSize, lineHeight: 26},
          }}>
          {body}
        </Markdown>
      ) : null}
      {metadata?.videoUrl ? (
        <View style={styles.video} renderToHardwareTextureAndroid>
          <YoutubePlayer
            height={190}
            videoId={metadata.videoUrl.split('=').pop()}
            play={false}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    height: '100%',
    paddingVertical: 10,
  },
  container: {
    paddingHorizontal: 10,
  },
  title: {
    marginBottom: 10,
  },
  video: {
    marginTop: 10,
  },
});

export default Chant;
