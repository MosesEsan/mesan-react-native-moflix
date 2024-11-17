import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { View, SafeAreaView, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';

// NAVIGATION
import { useNavigation, useRoute } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
// Panel,
import { PanelContainer } from 'mesan-react-native-panel';  
// , NavBackButton, NavButtons
import { ErrorView } from "react-native-helper-views";

// HOOKS
import useFetch from '../hooks/useFetch';
import useFavorites from '../hooks/useFavorites';
import useTMDB from '../hooks/useTMDB';

// SERVICES
import { getDetails } from '../core/Service';

// COMPONENTS
import DetailItem from "../components/DetailItem";

// CONFIG
import { colors } from "../core/Config"

// STYLES
// import { styles } from "../../../styles";

export default function Details(props) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION HOOKS
    const navigation = useNavigation();

    // ROUTE PARAMS
    const route = useRoute();
    const item = route.params?.item;

    // FAVORITES CONTEXT
    const { favorites, isFavorite, toggleFavorite } = useFavorites();

    // LOADING STATE AND ERROR
    const [
        //page, nextPage, totalResults, isFetchingNextPage
        { data, error, isFetching, isRefreshing },
        //  setPage, setNextPage, setTotalResults, setIsFetchingNextPage, setAPIResponse
        { setData, setError, setIsFetching, setIsRefreshing, setLoadingState }
    ] = useFetch();

    const [panels, setPanels] = useState([])

    //==================================================================================================
    //1B -NAVIGATION CONFIG
    useLayoutEffect(() => {
        // const navButtons = [
        //     {
        //         onPress: () => onToggle(),
        //         name: isItemFavorite ? "star" : "staro",
        //         type: "antdesign",
        //         color: "#fff",
        //         style: { paddingLeft: 5 }
        //     }
        // ];
        navigation.setOptions({
            headerTitle: "",
            // headerTitle: item.name || item.title || "Details",
            // headerLeft: () => <NavBackButton/>,
            // headerRight: () => <NavButtons buttons={navButtons} />,
        });
    }, [navigation]);

    //==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    // ==========================================================================================
    useEffect(() => {
        if (item) (async () => await getData())();
        else navigation.goBack()
    }, [])

    //2b - GET DATA
    async function getData(refresh = false) {
        try {
            // set the loading state
            if (!refresh) setIsFetching(true);
            else setIsRefreshing(true)

            // Set the passed item as the data
            setData(item);

            // make the API call and contruct the params
            let params = { append_to_response: "credits,videos" }
            let response = await getDetails(item?.release_date ? 'movie' : 'tv', item.id, params);

            // set the data
            setData(response);
            setPanels(getPanels(response))
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoadingState(false, false);
        }
    }

    // 2c - CREATE PANELS
    const getPanels = (item) => {
        const { videos, seasons, cast } = useTMDB(item);

        // The panels you want to create- this also can be declared in a separate file or elsewhere
        let panels = [
            // 1 - SEASONS
            {
                id: 0,
                title: "Seasons",
                type: "carousel",
                itemType: "seasons",
                data: seasons,
            },
            // 2 - CAST
            {
                id: 1,
                title: "Cast",
                type: "default",
                itemType: "credits",
                data: cast,
                max: 6,
                cta: true,
                onPress: () => navigation.push("Credits", { item })
            },
            // VIDEOS
            {
                id: 2,
                title: "Videos",
                type: "carousel",
                itemType: "video",
                data: videos
            },
        ]

        panels.map((p) => {
            p['containerStyle'] = { marginBottom: 15 };
            p['headerStyle'] = { color: colors.text, fontWeight: "500" };
            p['ctaTextStyle'] = { color: colors.text };
            // if the data length is greater than 0, update the renderItem function
            if (p.data.length > 0)  p['renderItem'] = (props) => <DetailItem {...props} type={p?.itemType} size={p?.itemSize} />
            else panels = panels.filter(panel => panel.id !== p.id); // remove the panel
        })

        return panels;
    }

    //===========================================================================================
    //3 - UI ACTION HANDLERS
    //==============================================================================================
    //3a - RENDER SCROLLVIEW VIEW CONTENT
    const renderScrollViewContent = () => {
        if (isFetching) return <ActivityIndicator style={[{ flex: 1 }]} />;

        if (error) return <ErrorView message={error} />;

        return (
            <View style={[]}>
                <DetailItem type={'header'} item={data} />
                <View style={{ flex: 1 }}>
                    <DetailItem type={'main'} item={data} />
                    <PanelContainer data={panels}/>
                </View>
            </View>
        )
    }

    // ==========================================================================================
    //5 -  ACTION HANDLERS
    //==========================================================================================
    const isItemFavorite = useMemo(() => {
        return isFavorite(item);
    }, [favorites]);

    const onToggle = () => {
        toggleFavorite(item);
        // create({ ...item, date: "blahblah" })
    }

    // const onUpdate = (item, newData) => {
    //     update(item.id, newData)
    // }

    // const onDelete = (item) => {
    //     destroy(item.id)
    // }

    //==========================================================================================
    // 6 - RENDER VIEW
    const refreshControl = <RefreshControl refreshing={isRefreshing} onRefresh={() => getData(true)} />
    return (
        <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
            <ScrollView
                contentContainerStyle={[{ backgroundColor: colors.primary }]}
                refreshControl={refreshControl}>
                {renderScrollViewContent()}
            </ScrollView>
        </SafeAreaView>
    );
};