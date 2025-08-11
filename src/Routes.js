import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import { NavigationContainer } from '@react-navigation/native';
// import * as Sentry from '@sentry/react-native';

import { db } from './store/database';
import migrations from './store/migrations/migrations';
import { useLoadChants } from './hooks/loadChants';
import List from './containers/List';
import Chant from './containers/Chant';
import Edit from './containers/Edition/Edit';
import Diff from './containers/Edition/Diff';
import Webview from './containers/Webview';
import Search from './containers/Search';

const Main = createNativeStackNavigator();

const Routes = ({ theme }) => {
  const { success, error } = useMigrations(db, migrations);
  const loadedEntities = useRef(false);
  const loadChants = useLoadChants();

  useEffect(() => {
    if (loadedEntities.current || !success) {
      return;
    }
    loadedEntities.current = true;
    loadChants();
  }, [success, loadChants]);

  if (error) {
    // TODO: reset db
    // Sentry.captureException(error);
    return <View />;
  }

  if (!success) {
    return <View />;
  }

  return (
    <NavigationContainer theme={theme}>
      <Main.Navigator>
        <Main.Screen
          options={{ headerShown: false, title: 'Chants' }}
          name="List"
          component={List}
        />
        <Main.Screen
          name="Search"
          options={{ headerShown: false, animation: 'fade' }}
          component={Search}
        />
        <Main.Screen name="Chant" options={{ title: '' }} component={Chant} />
        <Main.Screen name="Edit" options={{ title: '' }} component={Edit} />
        <Main.Screen name="Diff" options={{ title: '' }} component={Diff} />
        <Main.Screen name="Webview" component={Webview} />
      </Main.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
