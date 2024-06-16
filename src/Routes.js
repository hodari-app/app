import React, {useEffect, useRef} from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useMigrations} from 'drizzle-orm/op-sqlite/migrator';

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
    if (loadedEntities.current) {
      return;
    }
    loadedEntities.current = true;
    loadChants();
  }, []);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
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
