import React, { useState, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, FlatList } from 'react-native';

// NAVIGATION
import { useNavigation, useRoute } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { useCRUD, DataStatusView, NavBackButton } from "react-native-helper-views";

// HOOKS
import { useModuleContext } from "../core/Provider";

// SERVICES
import { getPanel, getByCategory, getSeasonEpisodes } from "../core/Service";

// COMPONENTS
import ModuleItem from "../components/ModuleItem";
import DetailItem from '../components/DetailItem';

// CONFIG
import { colors } from '../core/Config';

// NUM OF COLUMNS
const FLATLIST_COLUMNS = 2;

// STYLES
// import { styles } from "../styles";

export default function List(props) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();
    const route = useRoute();

    // HOOKS
    // if using Panels and/or Sections
    // Get the section from the Context
    const { section } = useModuleContext();

    // ROUTE PARAMS
    //Access the PARAMS data using:
    // if displaying the data for a specific panel
    const panel = route.params?.panel;

    // if displaying the data for a specific category
    const category = route.params?.category;

    // if an array of data is passed as a prop
    const passedData = route.params?.data;

    // The sceneType is used as the ModuleItem type
    const sceneType = route.params?.type;

    // the flatlist defults to 2 columns, to change this, a props can be pased
    const columns = route.params?.columns || props.columns || FLATLIST_COLUMNS;

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
            headerTitle: panel?.title || category?.name || route.params?.title || "",
            // headerRight: () => <NavButtons buttons={navButtons} />,
            // headerLeft: () => <NavBackButton onPress={navigation.goBack} />, // If using a custom back button
        });
    }, [navigation]);

    //==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    // ==========================================================================================
    useEffect(() => {
        (async () => {
            if (passedData) await setData(passedData)
            else await getData()
        })();
    }, [])

    //2b - GET DATA
    async function getData(refresh = false, params = {}) {
        // If not refreshing, empty the data array - OPTIONAL
        if (!refresh) setData([])

        if (!refresh) setIsFetching(true); 
        else setIsRefreshing(true)

        try {
            if (category) await getWithCategory();
            else if (sceneType === "episodes") await getEpisodes()
            else getPanelData(params)
        } catch (error) {
            onError(error.message);
        }
    }

    // 2c - GET PANEL DATA
    async function getPanelData(params){
        if (section) params['section'] = section.id;
        if (panel) params['panel'] = panel.url;//panel.id;

        let response = await getPanel(params)
        onCompleted(response?.results || []);
    }

    // 2d - GET DATA BY CATEGORY
    async function getWithCategory(){
        let params = {
            "primary_release_date.lte": "31-12-2024",
            page: 1,
            with_genres: category.id
        }
        let response = await getByCategory(section.slug, params)
        onCompleted(response?.results || []);
    }

    // 2e - GET EPISODES
    async function getEpisodes(){
        const series_id = route.params?.series_id;
        const season_number = route.params?.season_number;
        if (!series_id || !season_number){
            alert("Unable to get episodes", "Missing required parameters");
            navigation.goBack();
        }
        let response = await getSeasonEpisodes(series_id, season_number)
        onCompleted(response?.episodes || []);
    }

    //===========================================================================================
    //3 - API RESPONSE HANDLERS
    //===========================================================================================
    function onCompleted(data) {
        setData(data);
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
        // if displaying the data for a specific panel and the panel media_type is "category"
        // render the GridCategoryItem
        if (panel && panel?.media_type === "category") return <ModuleItem type={'category-grid'}item={item}/>

        if (sceneType) return <DetailItem type={sceneType} item={item} />

        return <ModuleItem type={'media-grid'} item={item} size={"medium"}/>
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
        data: data,
        extraData: data,
        initialNumToRender: 10,
        numColumns: columns || FLATLIST_COLUMNS,

        style: { backgroundColor: colors.primary},
        contentContainerStyle: { flexGrow: 1},

        renderItem: renderItem,
        ListEmptyComponent: renderEmpty,

        keyExtractor: (item, index) => `item_${item['id'].toString()}${index.toString()}`,
        refreshing: isRefreshing,
        onRefresh: () => getData(true)
    }

    return (
        <SafeAreaView style={{backgroundColor: colors.primary, flex:1}}>
            {/* //If using Flatlist */}
            <FlatList {...listProps} data={data} />
        </SafeAreaView>
    );
};