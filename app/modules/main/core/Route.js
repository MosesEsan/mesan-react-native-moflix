import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// SCENES
import DashboardScreen from '../scenes/Dashboard';
import ListScreen from '../scenes/List';
import DetailsScreen from '../scenes/Details';
import MediaPlayer from '../scenes/MediaPlayer';
import FavoritesScreen from '../scenes/Favorites';
import SearchScreen from '../scenes/Search';
import CreditsScreen from '../scenes/Credits';

// EXPORT THE SCREEN SHARED BY MULTIPLE SECTION, E.G. The Favorites screen will need access to the Details Screen
export { SearchScreen, FavoritesScreen, ListScreen, DetailsScreen, CreditsScreen, MediaPlayer };

// CONFIG
import { colors } from './Config';

// 1 - SCENES
export const scenes = [
  {
    name: "Dashboard",
    component: DashboardScreen
  },
  // {
  //   name: "List",
  //   component: ListScreen
  // },
  // {
  //   name: "Details",
  //   component: DetailsScreen
  // },
  // {
  //   name: "Favorites",
  //   component: FavoritesScreen
  // },
  // {
  //   name: "Search",
  //   component: SearchScreen
  // },
]


// 2 - NAVIGATION PROPS
const navigatorProps = {
  screenOptions: {
    headerStyle: {
      borderBottomWidth: 0,
      shadowColor: 'transparent',
      backgroundColor: colors.primary,
    },
    headerTitleStyle: {
      color: colors.text
    },
    headerTintColor: '#fff'
  },
}

// 2 - STACK NAVIGATOR
const Stack = createStackNavigator();

// 3 - MAIN STACK
export default function MainStackScreen() {
  return (
    <Stack.Navigator {...navigatorProps} initialRouteName={scenes[0].name}>
      {scenes.map((scene, index) => (<Stack.Screen key={index} name={scene.name} component={scene.component} options={{ title: scene.name }} />))}
    </Stack.Navigator>
  );
}