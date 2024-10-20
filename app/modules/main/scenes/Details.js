import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { View, SafeAreaView, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';

// NAVIGATION
import { useNavigation, useRoute } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import Panel from "mesan-react-native-panel";
import { ErrorView, useCRUD, NavBackButton, NavButtons } from "react-native-helper-views";

// PROVIDERS
import { useModuleContext } from "../core/Provider";

// SERVICES
import { getDetails } from '../core/Service';

// if using GRAPHQL
// import { GET_CATEGORY_DATA, ADD_TO_FAVOURITES } from "../ModuleService";

// COMPONENTS
import DetailItem from "../components/DetailItem";

// HOOKS
import useTMDB from '../hooks/useTMDB';

// CONFIG
import { colors } from "../core/Config"
import useFavorites from '../hooks/useFavorites';

// STYLES
// import { styles } from "../../../styles";

export default function Details(props) {
    // 1 - DECLARE VARIABLES
    
    // NAVIGATION HOOKS
    const navigation = useNavigation();
    const route = useRoute();

    // ROUTE PARAMS
    const item = route.params?.item;

    // FAVORITES CONTEXT
    const { favorites, isFavorite, toggleFavorite } = useModuleContext();

    // If not using Provider
    const {
        data, error,
        create, read, update, destroy,
        isFetching, isRefreshing,
        setIsRefreshing, setIsFetching,
        setLoading, setData, setError
    } = useCRUD(item);

    const [panels, setPanels] = useState([])

    // ===========================================================================================
    //1A - GRAPHQL
    // if using GRAPHQL
    // QUERY
    // const [getCategoryData, {refetch}] = useLazyQuery(GET_CATEGORY_DATA, {
    //     onCompleted, onError
    // });

    //  MUTATION    
    // const [addFavourite] = useMutation(ADD_TO_FAVOURITES, {
    //     onCompleted: () => alert("You have added tho your favourites"),
    //     onError: (error) => alert(error.message)
    // });

    //==================================================================================================
    //1B -NAVIGATION CONFIG - Custom Title and Right Nav Buttons
    // const navButtons = [
    //     {
    //         onPress: () => onToggle(),
    //         name: isItemFavorite ? "star" : "staro",
    //         type: "antdesign",
    //         color: "#fff",
    //         style: { paddingLeft: 5 }
    //     }
    // ];

    //1B -NAVIGATION CONFIG
    useLayoutEffect(() => {
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
        // If not refreshing, empty the data array - OPTIONAL
        if (!refresh) setData([]);

        if (!refresh) setIsFetching(true); 
        else setIsRefreshing(true)

        setData(item);

        // if using GRAPHQL
        // const variables = {} //Add any required variables/params
        // if (refresh) await refetch(variables)
        // else await getDetails({variables})

        try {
            let params = { append_to_response: "credits,videos" }
            let response = await getDetails(item?.release_date ? 'movie' : 'tv', item.id, params);
            onCompleted(response);
        } catch (error) {
            alert(error.message);
            onError(error);
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
                itemType: "cast-crew",
                data: cast,
                max: 6,
                cta: true,
                onPress: () => navigation.push("List", { title: "Cast", data: cast, columns: 1, type: 'cast-crew' })
            },
            {
                id: 2,
                title: "Videos",
                type: "carousel",
                itemType: "video",
                data: videos
            },
        ]
        panels.map((p) => {
            // if the data length is greater than 0, updater the renderItem
            // else remove the panel
            if (p.data.length > 0){
                p['renderItem'] = (props) => <DetailItem {...props} type={p?.itemType} size={p?.itemSize} />
            }else{
                panels = panels.filter(panel => panel.id !== p.id)
            }
        })

        return panels;
    }

    //===========================================================================================
    //3 - API RESPONSE HANDLERS
    //===========================================================================================
    function onCompleted(data) {
        // if using GRAPHQL
        // if (data && data.products) setData(data.products)

        // else if using RESTAPI
        setData(data);
        setPanels(getPanels(data))

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
    //4a - RENDER SCROLLVIEW VIEW CONTENT
    const renderScrollViewContent = () => {
        if (isFetching) return <ActivityIndicator style={[{ flex: 1 }]} />;

        if (error) return <ErrorView message={error} />;

        return (
            <View style={[]}>
                <DetailItem type={'header'} item={data} />
                <View style={{ flex: 1 }}>
                    <DetailItem type={'main'} item={data} />
                    <MetaAdditional panels={panels} />
                </View>
            </View>
        )
    }

    // ==========================================================================================
    //5 -  ACTION HANDLERS
    //==========================================================================================
    const isItemFavorite = useMemo(() => {
        return isFavorite(item);
    }, [favorites ]);

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


const MetaAdditional = ({ panels }) => {
    return (
        <View style={{ flex: 1 }}>
            {panels.map((panel, index) => {
                return (
                    <Panel key={`panel_${index}`} {...panel}
                        containerStyle={{ marginBottom: 15 }}
                        ctaContainerStyle={{}}
                        ctaTextStyle={{ color: colors.text }}
                        headerStyle={{ color: colors.text, fontWeight: "500" }}
                    />
                )
            })}
        </View>
    )
}