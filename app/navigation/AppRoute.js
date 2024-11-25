import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BootSplash from "react-native-bootsplash";

import AppTabs from './AppTabs';

// If not using Tabs - Import the Module Routes
// import ModuleRoute from "../modules/main/core/Route";

// if using tabs and a view is shared by multiple sections, import it here
import {
  ListScreen,
  DetailsScreen,
  CreditsScreen,
  MediaPlayer
} from "../modules/main/core/Route";

// CONFIG
import { colors } from '../modules/main/core/Config';

export default function AppRoute() {
  //2 - MAIN CODE BEGINS HERE
  useEffect(() => {
    setTimeout(async () => {
      await BootSplash.hide({ fade: true });
    }, 3000)
  },);

  const screenOptions = {
    headerStyle: {
      borderBottomWidth: 0,
      shadowColor: 'transparent',
      backgroundColor: colors.primary,
    },
    headerTitleStyle: { color: colors.text },
    headerTintColor: '#fff'
  };

  // 3 - CREATE THE NAVIGATOR
  const RootStack = createStackNavigator();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Group>
            <RootStack.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
            <RootStack.Screen name={"List"} component={ListScreen} options={{ ...screenOptions }} />
            <RootStack.Screen name={"Credits"} component={CreditsScreen} options={{ ...screenOptions }} />
            <RootStack.Screen name={"MediaPlayer"} component={MediaPlayer} options={{ ...screenOptions }} />
          </RootStack.Group>
          <RootStack.Group screenOptions={{ presentation: 'modal' }}>
            <RootStack.Screen name={"Details"} component={DetailsScreen} options={{ headerShown: false }} />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}