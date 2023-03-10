import React, {useEffect, useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useLoadChants} from './hooks/loadChants';
import ChantsList from './containers/List/ChantsList';
import Chant from './containers/Chant';
import About from './containers/About';
import Webview from './containers/Webview';

const Main = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabBar = ({navigation, state, descriptors, insets}) => (
  <BottomNavigation.Bar
    navigationState={state}
    safeAreaInsets={insets}
    onTabPress={({route, preventDefault}) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        preventDefault();
      } else {
        navigation.navigate(route);
      }
    }}
    renderIcon={({route, focused, color}) => {
      const {options} = descriptors[route.key];
      if (options.tabBarIcon) {
        return options.tabBarIcon({focused, color, size: 24});
      }

      return null;
    }}
    getLabelText={({route}) => {
      const {options} = descriptors[route.key];
      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.title;

      return label;
    }}
  />
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={tabBar}>
      <Tab.Screen
        name="ChantsList"
        component={ChantsList}
        options={{
          tabBarLabel: 'Chants',
          tabBarIcon: ({color, size}) => {
            return <Icon name="music-note" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="About"
        component={About}
        options={{
          tabBarLabel: 'Hodari',
          tabBarIcon: ({color, size}) => {
            return (
              <Icon name="book-open-blank-variant" size={size} color={color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

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
