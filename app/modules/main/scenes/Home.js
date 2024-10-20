import React, { useState, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, View, Pressable, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
// If using a filter view to display the sections
// import the react-native-filter-component and the Dashboard component 
import { FilterView } from "react-native-filter-component";
import { NavButtons, CustomNavTitle } from "react-native-helper-views";

// SERVICES
import { getSections } from "../core/Service";

// HOOKS    
import { useModuleContext } from "../core/Provider";

// COMPONENTS
import Dashboard from './Dashboard';

export default function Home() {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // HOOKS
    const { section, setSection, sections, setSections } = useModuleContext();

    // LOADING STATE AND ERROR
    const [isFetching, setIsFetching] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(false);

    //========================================================================================
    //1B -NAVIGATION CONFIG - Custom Title and Right Nav Buttons
    const navButtons = [
        //     {
        //     onPress: () => alert("Search coming soon...."),
        //     name: "search",
        //     type: "ionicon",
        //     color: "#fff",
        //     style: { paddingLeft: 5 }
        // },
        {
            onPress: () => navigation.navigate('Favorites'),
            name: "favorite",
            type: "fontisto",
            color: "#fff",
            size: 20,
            style: { paddingLeft: 5 }
        }
    ];

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            // headerLeft: () => <CustomNavTitle title={"Dashboard"} style={styles.navBar} titleStyle={styles.navBatTitle} />,
            headerRight: () => <NavButtons buttons={navButtons} />,
        });
    }, [navigation]);

    //==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    // ==========================================================================================
    useEffect(() => {
        (async () => await getData())();
    }, []);

    //2b - GET DATA
    async function getData(refresh = false, params = {}) {
        // If not refreshing, empty the data array - OPTIONAL
        // if (!refresh) setData([])

        if (!refresh) setIsFetching(true);
        else setIsRefreshing(true)

        try {
            let response = await getSections();
            onCompleted(response?.sections);
        } catch (error) {
            alert(error.message)
            onError(error);
        }
    }

    //===========================================================================================
    //3 - API RESPONSE HANDLERS
    //===========================================================================================
    function onCompleted(data) {
        // setData(data);
        setSections(data);
        setSection(data[0])

        setError(null);
        setIsFetching(false)
        setIsRefreshing(false)
    }

    function onError(error) {
        setError(error.message)
        setIsFetching(false)
        setIsRefreshing(false)
    }

    //==============================================================================================
    //4 -  UI ACTION HANDLERS
    //==============================================================================================
    //4a - RENDER ITEM
    const renderItem = ({ item, index }) => {
        return (
            <Pressable onPress={() => onSectionSelected(item)} key={`menuitem_{${idx}}`}>
                <View key={`section_${idx}`}
                    style={[styles.menuItem,
                    {
                        height: (height - 64 - 30) / sections.length,
                        backgroundColor: item?.color || "green",
                    }]}>
                    <Text style={[styles.menuItemText]}>{item.name}</Text>
                </View>
            </Pressable>
        )
    }

    //4a - RENDER SCROLLVIEW VIEW CONTENT
    const renderScrollViewContent = () => {
        if (isFetching) return <ActivityIndicator style={[{ flex: 1 }]} />;

        if (error) return <ErrorView message={error} />;

        return (
            <View style={[]}>
                { sections.map((section, index) => renderItem({ item: section, index }))}
            </View>
        )
    }
    
    // ==========================================================================================
    //5 -  ACTION HANDLERS
    //==========================================================================================
    async function onSectionSelected(selected) {
        setSection(selected);

        //If not using filterview i.e. displaying section data in a new screen 
        // navigation.navigate('Dashboard');
    };

    // ==========================================================================================
    // 6 - RENDER VIEW
    //==========================================================================================
    const filterViewProps = {
        data: sections,
        misc: section ? [section] : [],
        initialIndex: 0,
        onItemPress: onSectionSelected,
        ...filterViewStyles,
    }

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: "#141414" }]}>
            {/* If using the the filter view */}
            <FilterView {...filterViewProps} />
            {section && <Dashboard section={section} />}

            {/* If not using the the filter view */}
            {/* <ScrollView>
                {renderScrollViewContent()}
            </ScrollView> */}
        </SafeAreaView>
    );
};

const filterViewStyles = StyleSheet.create({
    headerStyle: { color: "white" },
    containerStyle: {
        backgroundColor: "transparent",
    },
    itemContainerStyle: {
        backgroundColor: "transparent",
        borderWidth: 0,
        marginVertical: 0,
        height: 34
    },
    itemTitleStyle: {
        fontSize: 14,
        color: "white",
        fontWeight: "500"
    },
    selectedStyle: {
        backgroundColor: "rgb(45, 45, 45)"
    },
    selectedTitleStyle: {
        color: "#fff",
    },
    ctaStyle: { color: "#fff" },
});
