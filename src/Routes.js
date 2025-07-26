import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {useAtomValue} from 'jotai';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useMigrations} from 'drizzle-orm/op-sqlite/migrator';
import {NavigationContainer} from '@react-navigation/native';
// import * as Sentry from '@sentry/react-native';

import {useLoadChants} from './hooks/loadChants';
import ChantsList from './containers/List/ChantsList';
import Chant from './containers/Chant';
import Edit from './containers/Edition/Edit';
import Diff from './containers/Edition/Diff';
import Webview from './containers/Webview';
import {db} from './store/database';
import migrations from './store/migrations/migrations';
import {currentChantState} from './store/store';

const Main = createNativeStackNavigator();

const Routes = ({theme}) => {
  const {success, error} = useMigrations(db, migrations);
  const loadedEntities = useRef(false);
  const loadChants = useLoadChants();
  const currentChantId = useAtomValue(currentChantState);

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

  let initialState = null;
  if (currentChantId) {
    initialState = {
      index: 1,
      routes: [
        {name: 'TabNavigator'},
        {
          name: 'Chant',
          params: {id: currentChantId},
        },
      ],
    };
  }

  return (
    <NavigationContainer theme={theme} initialState={initialState}>
      <Main.Navigator>
        <Main.Screen
          options={{headerShown: false, title: 'Chants'}}
          name="TabNavigator"
          component={ChantsList}
        />
        <Main.Screen name="Chant" options={{title: ''}} component={Chant} />
        <Main.Screen name="Edit" options={{title: ''}} component={Edit} />
        <Main.Screen name="Diff" options={{title: ''}} component={Diff} />
        <Main.Screen name="Webview" component={Webview} />
      </Main.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
