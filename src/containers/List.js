import React, { Suspense } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation, Icon, Searchbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';

import Chants from './List/Chants';
import Empty from './List/Empty';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ navigation, state, descriptors, insets }) => (
  <BottomNavigation.Bar
    navigationState={state}
    safeAreaInsets={insets}
    onTabPress={({ route, preventDefault }) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        preventDefault();
      } else {
        navigation.dispatch({
          ...CommonActions.navigate(route.name, route.params),
          target: state.key,
        });
      }
    }}
    renderIcon={({ route, focused, color }) => (
      <Icon
        source={descriptors[route.key].options.icon}
        size={24}
        color={color}
      />
    )}
    getLabelText={({ route }) => {
      const { options } = descriptors[route.key];
      return typeof options.tabBarLabel === 'string'
        ? options.tabBarLabel
        : typeof options.title === 'string'
        ? options.title
        : route.name;
    }}
  />
);

function List() {
  const navigation = useNavigation();

  const fallback = (
    <Empty>
      <Text>Chargement...</Text>
    </Empty>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <Searchbar
        icon="music"
        style={styles.searchBar}
        placeholder="Rechercher un chant..."
        onPress={() => navigation.navigate('Search')}
        disabled
      />
      <Suspense fallback={fallback}>
        <Tab.Navigator
          screenOptions={{
            animation: 'shift',
            headerShown: false,
          }}
          tabBar={CustomTabBar}
        >
          <Tab.Screen name="Tous" options={{ icon: 'music' }}>
            {() => <Chants mode="all" />}
          </Tab.Screen>
          <Tab.Screen name="Récents" options={{ icon: 'history' }}>
            {() => <Chants mode="recent" />}
          </Tab.Screen>
          <Tab.Screen name="Favoris" options={{ icon: 'heart' }}>
            {() => <Chants mode="favorites" />}
          </Tab.Screen>
        </Tab.Navigator>
      </Suspense>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 10,
  },
});

export default List;
