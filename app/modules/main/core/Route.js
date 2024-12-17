import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// SCENES
import DashboardScreen from '../scenes/Dashboard';
import ListScreen from '../scenes/List';
import MoviesScreen from "../scenes/Movies"
import DetailsScreen from '../scenes/Details';
import MediaPlayer from '../scenes/MediaPlayer';
import FavoritesScreen from '../scenes/Favorites';
import SearchScreen from '../scenes/Search';
import CreditsScreen from '../scenes/Credits';
import PersonScreen from '../scenes/Person'

// EXPORT THE SCREEN SHARED BY MULTIPLE SECTION, E.G. The Favorites screen will need access to the Details Screen
export { SearchScreen, FavoritesScreen, ListScreen, MoviesScreen, DetailsScreen, CreditsScreen, MediaPlayer, PersonScreen };

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

// 3 - MAIN STACK
export default function MainStackScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator {...navigatorProps} initialRouteName={scenes[0].name}>
      {scenes.map((scene, index) => (<Stack.Screen key={index} name={scene.name} component={scene.component} options={{ title: scene.name }} />))}
    </Stack.Navigator>
  );
}