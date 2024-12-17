import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { View, SafeAreaView, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';

// NAVIGATION
import { useNavigation, useRoute } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { PanelContainer } from 'mesan-react-native-panel';
import { ErrorView, NavBackButton, NavButtons } from "react-native-helper-views";

// HOOKS
import useFetch from '../hooks/useFetch';
import useTMDB from '../hooks/useTMDB';

// SERVICES
import { getPersonDetails } from '../core/Service';

// COMPONENTS
import Header from '../components/Header';
import ModuleItem from '../components/ModuleItem';
import DetailItem from "../components/DetailItem";

// CONFIG
import { colors } from "../core/Config"

export default function Person(props) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION HOOKS
    const navigation = useNavigation();

    // ROUTE PARAMS
    const route = useRoute();
    const item = route.params?.item;

    // LOADING STATE AND ERROR
    const [
        { data, error, isFetching, isRefreshing },
        { setData, setError, setIsFetching, setIsRefreshing, setLoadingState }
    ] = useFetch();

    const [panels, setPanels] = useState([])

    //==================================================================================================
    //1B -NAVIGATION CONFIG
    useLayoutEffect(() => {
        // const navButtons = [
        //     {onPress: () => onToggle(), name: isItemFavorite ? "star" : "staro", type: "antdesign", color: "#fff", style: { paddingLeft: 5 }}
        // ];
        navigation.setOptions({
            headerTitle: "", //item.name || item.title || "Details",
            // headerLeft: null,
            headerLeft: () => <NavBackButton onPress={() => navigation.goBack()} />, //<NavButtons buttons={navButtons} />,
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
            let params = { append_to_response: "tv_credits,movie_credits" }
            let response = await getPersonDetails(item.id, params);

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
        const { tv_credits, movie_credits } = item;
        console.log(tv_credits)

        // The panels you want to create- this also can be declared in a separate file or elsewhere
        let panels = [
            // 1 - TV Credits
            {
                id: 0,
                title: "Movie Credits",
                data: movie_credits?.cast,
            },
            // 2 - Movie Credits
            {
                id: 1,
                title: "TV Credits",
                data: tv_credits?.cast,
                // onPress: () => navigation.push("Credits", { item })
            },
            // Popular Movies
            // {
            //     id: 2,
            //     title: "Trailers & Behind the Scene",
            //     type: "carousel",
            //     itemType: "video",
            //     data: videos
            // },
        ]

        panels.map((p) => {
            // p['max'] = 6;
            p['type'] = "carousel";
            p['itemType'] = "media";

            p['containerStyle'] = { marginBottom: 15 };
            p['headerStyle'] = { color: colors.text, fontWeight: "500" };
            p['ctaTextStyle'] = { color: colors.text };
            // if the data length is greater than 0, update the renderItem function
            if (p.data.length > 0) p['renderItem'] = (props) => <ModuleItem {...props} type={p?.itemType} size={p?.itemSize} />
            else panels = panels.filter(panel => panel.id !== p.id); // remove the panel
        });

        console.log("====")
        console.log(panels)

        console.log("====")
        return panels;
    }

    //===========================================================================================
    //3 - UI ACTION HANDLERS
    //==============================================================================================
    // 3d - RENDER ERROR
    const renderError = () => {
        return <ErrorView message={error} onPress={getData} />
    }

    // 3e - RENDER LOADING
    const renderLoading = () => {
        return <ActivityIndicator style={{ backgroundColor: colors.primary, flex: 1 }} />
    }

    //==========================================================================================
    // 6 - RENDER VIEW
    //==========================================================================================
    const refreshControl = <RefreshControl refreshing={isRefreshing} onRefresh={() => getData(true)} />
    return (
        <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
            <ScrollView
                contentContainerStyle={[{ backgroundColor: colors.primary }]}
                refreshControl={refreshControl}>
                {(isFetching) ? renderLoading() : (error) ? renderError() : (
                        <View style={{ flex: 1 }}>
                            <DetailItem type={'person'} item={data} />
                            <PanelContainer data={panels} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};