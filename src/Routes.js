import React, {useEffect, useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useLoadChants} from './hooks/loadChants';
import ChantsList from './containers/List/ChantsList';
import Chant from './containers/Chant';
import Webview from './containers/Webview';

const Main = createNativeStackNavigator();

const Routes = () => {
  const loadedEntities = useRef(false);
  const loadChants = useLoadChants();

  useEffect(() => {
    if (loadedEntities.current) {
      return;
    }
    loadedEntities.current = true;
    loadChants();
  }, []);

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
