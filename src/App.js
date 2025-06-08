import React, {useEffect} from 'react';
import {Platform, StatusBar, StyleSheet, useColorScheme} from 'react-native';
// import * as Sentry from '@sentry/react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import Routes from './Routes';
import {CombinedDarkTheme, CombinedDefaultTheme} from './theme';

// Sentry.init({
//   dsn: 'https://e3ef6c89684f443994ca2ac78bdc5263@o4504814174142464.ingest.sentry.io/4504814176239616',
//   // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
//   // We recommend adjusting this value in production.
//   tracesSampleRate: 1.0,
//   enabled: !__DEV__,
//   debug: __DEV__,
// });

const renderIcon = props => <MaterialDesignIcons {...props} />;

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  }, [isDarkMode]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider
        theme={theme}
        settings={{
          icon: renderIcon,
        }}>
        <NavigationContainer theme={theme}>
          <Routes />
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App; //Sentry.wrap(App);
