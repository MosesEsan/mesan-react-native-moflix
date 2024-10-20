import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// SCENES
import HomeScreen from '../scenes/Home';
import DashboardScreen from '../scenes/Dashboard';
import ListScreen from '../scenes/List';
import DetailsScreen from '../scenes/Details';
import MediaPlayer from '../scenes/MediaPlayer';
import FavoritesScreen from '../scenes/Favorites';

// CONFIG
import { colors } from './Config';

const Stack = createStackNavigator();

const headerStyle = {
  borderBottomWidth: 0,
  shadowColor: 'transparent',
  backgroundColor: colors.primary,
}

const headerTitleStyle = {
  color: colors.text
}

const headerTintColor = '#fff';

// 1 - SCENES
export const scenes = [
  {
      name: "Home",
      component: HomeScreen
  },
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
  }
]

// 2 - STACK NAVIGATOR
export default function ModuleStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{headerStyle, headerTitleStyle, headerTintColor}}>
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