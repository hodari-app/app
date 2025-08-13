import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { version } from '../../package.json';

function About() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <List.Section>
          <List.Item onPress={() => {}} title="Proposer un chant" />
          <List.Item
            onPress={() =>
              navigation.navigate('Webview', {
                title: 'Politique de confidentialité',
                uri: 'https://hodari-server.pages.dev/privacy-policy',
              })
            }
            title="Politique de confidentialité"
          />
          <List.Item onPress={() => {}} title={`Version ${version}`} />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight + 10,
  },
});

export default About;
