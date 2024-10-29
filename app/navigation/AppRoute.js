import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BootSplash from "react-native-bootsplash";

// import AppTabs from './AppTabs';

// If not using Tabs - Import the Module Routes
import ModuleRoute from "../modules/main/core/Route";

const Stack = createStackNavigator();

export default function AppRoute() {
  //2 - MAIN CODE BEGINS HERE
  useEffect(() => {
    setTimeout(async () => {
      await BootSplash.hide({ fade: true });
    }, 5000)
  },);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="App" component={ModuleRoute} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
