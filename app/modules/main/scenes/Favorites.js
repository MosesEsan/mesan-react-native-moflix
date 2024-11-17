import React, { useState, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, FlatList } from 'react-native';

// NAVIGATION
import { useNavigation, useRoute } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { useCRUD, DataStatusView, NavBackButton } from "react-native-helper-views";

// SERVICES
import { } from "../core/Service";

// HOOKS
import useFavorites from '../hooks/useFavorites';

// COMPONENTS
import ModuleItem from "../components/ModuleItem";

// CONFIG
import { colors } from '../core/Config';

// NUM OF COLUMNS
const FLATLIST_COLUMNS = 3;

// STYLES
// import { styles } from "../styles";

export default function Favorites(props) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();
    const route = useRoute();

    // HOOKS
    const { favorites, getFavorites } = useFavorites();

    // LOADING STATE AND ERROR
    const {
        data, error,
        isFetching, isRefreshing,
        setData, setError,
        setIsFetching, setIsRefreshing
    } = useCRUD([])

    //========================================================================================
    //1B -NAVIGATION CONFIG - Custom Title and Right Nav Buttons
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Favorites",
            // headerRight: () => <NavButtons buttons={navButtons} />,
            // headerLeft: () => <NavBackButton onPress={navigation.goBack} />, // If using a custom back button
        });
    }, [navigation]);
    
    //==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    // ==========================================================================================
    useEffect(() => {
        (async () => await getData())();
    }, [])

    //2b - GET DATA
    async function getData(refresh = false, params = {}) {
        // If not refreshing, empty the data array - OPTIONAL
        if (!refresh) setData([])

        setLoading(true, refresh);

        try {
            let response = await getFavorites(params)
            onCompleted(response);
        } catch (error) {
            onError(error.message);
        }
    }

    //===========================================================================================
    //3 - API RESPONSE HANDLERS
    //===========================================================================================
    function onCompleted(data) {
        setData(data);
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
    //4A - RENDER ITEM
    const renderItem = ({ item, index }) => {
        return <ModuleItem type={'media-grid'} item={item}/>
    }

    //4b - RENDER EMPTY
    const renderEmpty = () => {
        return <DataStatusView isFetching={isFetching} error={error} onRetry={() => getData(false)} />
    };

    // ==========================================================================================
    //5 -  ACTION HANDLERS
    //==========================================================================================

    // ==========================================================================================
    // 6 - RENDER VIEW
    //==========================================================================================
    const listProps = {
        data: favorites,
        extraData: favorites,
        initialNumToRender: 10,
        numColumns: FLATLIST_COLUMNS,

        style: { backgroundColor: colors.primary},
        contentContainerStyle: { flexGrow: 1},

        renderItem: renderItem,
        ListEmptyComponent: renderEmpty,

        keyExtractor: (item, index) => `item_favorite${index.toString()}`,
        refreshing: isRefreshing,
        onRefresh: () => getData(true)
    }

    // 6 - RENDER VIEW
    return (
        <SafeAreaView style={{backgroundColor: colors.primary, flex:1}}>
            <FlatList {...listProps} data={data} />
        </SafeAreaView>
    );
};