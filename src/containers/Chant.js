import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Markdown from '@ronradtke/react-native-markdown-display';
import {Appbar, Text, useTheme} from 'react-native-paper';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useRecoilState, useRecoilValue} from 'recoil';

import {chantsState, favoritesState} from '../store/store';

function Chant({navigation, route}) {
  const {id} = route.params;
  const theme = useTheme();
  const chants = useRecoilValue(chantsState);
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const [fontSize, setFontSize] = useState(18);

  const {chant, ...metadata} = chants.find(c => c.id === id) || {chant: ''};
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
  }, [navigation, favorites]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        {metadata.title}
      </Text>
      {chant ? (
        <Markdown
          style={{
            body: {color: theme.colors.onSurface, fontSize, lineHeight: 26},
          }}>
          {chant}
        </Markdown>
      ) : null}
      {metadata?.youtube ? (
        <View style={styles.video} renderToHardwareTextureAndroid>
          <YoutubePlayer
            height={190}
            videoId={metadata.youtube.split('=').pop()}
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
    paddingHorizontal: 15,
  },
  container: {
    paddingBottom: 80,
  },
  title: {
    marginTop: 10,
    marginBottom: 15,
  },
  video: {
    marginTop: 30,
    height: 190,
  },
});

export default Chant;
