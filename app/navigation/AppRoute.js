import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from "react-native";
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// import AppTabs from './AppTabs';

// If not using Tabs - Import the Module Routes
import ModuleRoute from "../modules/main/core/Route";
import { colors } from '../modules/main/core/Config';

const Stack = createStackNavigator();

export default function AppRoute() {
  //1 - DECLARE VARIABLES
  const [isLoading, setIsLoading] = useState(true);
  
  //2 - MAIN CODE BEGINS HERE
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  }, );

  // We haven't finished checking for the token yet
  if (isLoading) return <ActivityIndicator style={[{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor:colors.primary}]}/>

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{}} style={{backgroundColor: 'green'}}>
          <Stack.Screen name="App" component={ModuleRoute} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
