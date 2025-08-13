import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';

function Webview({ route }) {
  const navigation = useNavigation();
  const { title = '', uri = '' } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation, title]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView source={{ uri }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Webview;
