import React from 'react';

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Icon from '@rneui/themed/dist/Icon';

import MainRoute, {
    FavoritesScreen as FavoritesRoute,
    SearchScreen as SearchRoute,
    ListScreen as ListRoute
} from "../modules/main/core/Route";

//1 - CONFIG
import { colors } from '../modules/main/core/Config';
const screenOptions = {
    headerStyle: {
        borderBottomWidth: 0,
        shadowColor: 'transparent',
        backgroundColor: colors.primary,
    },
    headerTitleStyle: { color: colors.text },
    headerTintColor: '#fff'
};

// 2 - CREATE THE TABS 
export default function TabsStack() {
    // 1 - TAB PROPS
    const tabsScreenOptions = ({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let icon;
            color = focused ? "#fff" : "rgb(130, 130, 130)";
            if (route.name === 'Home') icon = { name: 'home', type: 'feather' }
            else if (route.name === 'Search') icon = { name: 'search', type: 'ionicon', size: 23 }
            else if (route.name === 'Favorites') icon = { name: 'favorite', type: 'fontisto', size: 23 }
            return <Icon {...icon} color={color} />;
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: colors.primary, borderTopWidth: 0 }
    });

    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator screenOptions={tabsScreenOptions}>
            <Tab.Screen name="Home" component={MainRoute} options={{ headerShown: false }} />
            <Tab.Screen name="Search" component={SearchRoute} options={{ headerShown: true, ...screenOptions }} />
            <Tab.Screen name="Favorites" component={FavoritesRoute} options={{ headerShown: true, ...screenOptions }} />
        </Tab.Navigator>
    );

}

