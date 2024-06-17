import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useMigrations} from 'drizzle-orm/op-sqlite/migrator';
import * as Sentry from '@sentry/react-native';

import {useLoadChants} from './hooks/loadChants';
import ChantsList from './containers/List/ChantsList';
import Chant from './containers/Chant';
import Webview from './containers/Webview';
import {db} from './store/database';
import migrations from './store/migrations/migrations';

const Main = createNativeStackNavigator();

const Routes = () => {
  const {success, error} = useMigrations(db, migrations);
  const loadedEntities = useRef(false);
  const loadChants = useLoadChants();

  useEffect(() => {
    if (loadedEntities.current || !success) {
      return;
    }
    loadedEntities.current = true;
    loadChants();
  }, [success]);

  if (error) {
    // TODO: reset db
    Sentry.captureException(error);
    return <View />;
  }

  if (!success) {
    return <View />;
  }

  return (
    <Main.Navigator initialRouteName="TabNavigator">
      <Main.Screen
        options={{headerShown: false}}
        name="TabNavigator"
        component={ChantsList}
      />
      <Main.Screen name="Chant" options={{title: ''}} component={Chant} />
      <Main.Screen name="Webview" component={Webview} />
    </Main.Navigator>
  );
};

export default Routes;
