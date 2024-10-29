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

// CONFIG
import { colors } from './Config';

// 1 - SCENES
export const scenes = [
  {
    name: "Dashboard",
    component: DashboardScreen
  },
  {
    name: "List",
    component: ListScreen
  },
  {
    name: "Details",
    component: DetailsScreen
  },
  {
    name: "Favorites",
    component: FavoritesScreen
  },
  {
    name: "MediaPlayer",
    component: MediaPlayer
  },
  {
    name: "Credits",
    component: CreditsScreen
  }
]

// 2 - NAVIGATION PROPS
const navigatorProps = {
  initialRouteName: "Home",
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
function MainStackScreen() {
  return (
    <Stack.Navigator {...navigatorProps} initialRouteName={scenes[0].name}>
      {
        scenes.map((scene, index) => {
          return (
            <Stack.Screen
              key={index}
              name={scene.name}
              component={scene.component}
              options={{ title: scene.name }}
            />
          )
        })
      }
    </Stack.Navigator>
  );
}

export default function ModuleStack() {
  return (
    <Stack.Navigator {...navigatorProps} initialRouteName={"Main"} mode="modal">
      <Stack.Screen name="Main" component={MainStackScreen} options={{ headerShown: false }} />
      <Stack.Screen name={"Search"} component={SearchScreen} options={{ title: "Search", headerShown: false }} />
    </Stack.Navigator>
  );
}