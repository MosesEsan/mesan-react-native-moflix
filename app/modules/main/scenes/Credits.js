import React, { useEffect, useState, useLayoutEffect } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, RefreshControl, StyleSheet } from 'react-native';

// NAVIGATION
import { useNavigation, useRoute } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { FilterView } from "react-native-filter-component";
import { EmptyView, ErrorView, NavButtons, CustomNavTitle } from "react-native-helper-views";

// HOOKS
import useFetch from '../hooks/useFetch';

// SERVICES
import { getCredits } from "../core/Service";

// COMPONENTS
import DetailItem from "../components/DetailItem";

// CONFIG
import { colors } from "../core/Config"

// STYLES
// import { styles } from "../styles";

const SECTIONS = [
    { id: 1, name: "Cast" },
    { id: 2, name: "Crew" }
]

export default function Dashboard({ }) {
    //1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // HOOKS

    // LOADING STATE AND ERROR
    const [
        //page, nextPage, totalResults, isFetchingNextPage
        { data, error, isFetching, isRefreshing },
        //  setPage, setNextPage, setTotalResults, setIsFetchingNextPage, setAPIResponse
        { setData, setError, setIsFetching, setIsRefreshing, setLoadingState }
    ] = useFetch();

    // ROUTE PARAMS
    // If the data was passed as a Route parameter
    const route = useRoute();
    const item = route.params?.item;

    // FILTER VIEW VARIABLES
    // const [sections, setSections] = useState([]);
    const [section, setSection] = useState(SECTIONS[0]);

    //==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    // ==========================================================================================
    useEffect(() => {
        (async () => {
            if (!item) {
                alert("Unable to get credits", "Missing required parameters");
                navigation.goBack();
            } else if (section) await getData(false);
        })();
    }, [section]);

    // 2c - GET DATA
    async function getData(refresh = false, params = {}) {
        try {
            // set the loading state
            setLoadingState(!refresh, refresh);

            const { credits = {} } = item;
            const { crew = [], cast = [] } = credits;

            if (section.id === 1) setData(cast);
            else setData(crew);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoadingState(false, false);
        }
    }

    //===========================================================================================
    //3 - UI ACTION HANDLERS
    //==========================================================================================
    //3a - RENDER ITEM
    const renderItem = ({ item, index }) => {
        return <DetailItem type={'credits'} item={item} />
    }

    //3b - RENDER EMPTY
    const renderEmpty = () => {
        let props = { color: colors.text }
        let textProps = { titleStyle: props, textStyle: props }
        return <EmptyView title={"No Data."} message={"No data to show"} {...textProps} />
    };

    //3c - RENDER FOOTER
    // const renderFooter = () => {
    //     return hasNextPage && isFetchingNextPage ? (
    //         <ActivityIndicator size="small" color={colors.text} style={{ height: 50 }} />
    //     ) : null;
    // };

    // 3d - RENDER ERROR
    const renderError = () => {
        return <ErrorView message={error} onPress={() => getData(false)} />
    }

    // 3e - RENDER LOADING
    const renderLoading = () => {
        return <ActivityIndicator style={{ backgroundColor: colors.primary, flex: 1 }} />
    }

    // ==========================================================================================
    //4 -  ACTION HANDLERS
    //==========================================================================================
    // 4a - ON SECTION SELECTED
    async function onSectionSelected(selected) {
        setSection(selected);
    };

    // If using Infinite Scroll - Load More Data
    // let onEndReached = () => !isFetching && fetchNextPage()

    // ==========================================================================================
    // 5 - RENDER VIEW
    //==========================================================================================
    // FILTER VIEW PROPS
    const filterViewProps = {
        data: SECTIONS,
        misc: section ? [section] : [],
        initialIndex: 0,
        onItemPress: onSectionSelected,
        ...filterViewStyles,
    }

    // FLATLIST PROPS
    const listProps = {
        data: data,
        extraData: data,
        initialNumToRender: 10,

        style: { backgroundColor: colors.primary },
        contentContainerStyle: { flexGrow: 1 },

        renderItem: renderItem,
        ListEmptyComponent: renderEmpty,

        keyExtractor: (item, index) => `item_${item['id'].toString()}${index.toString()}`,
        refreshing: isRefreshing,
        onRefresh: () => getData(true),

        // If using Infinite Scroll
        // onEndReached,
        // onEndReachedThreshold: 0,
        // ListFooterComponent: renderFooter
    }

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: colors.primary }]}>
            {/* If using the the filter view */}
            <FilterView {...filterViewProps} />
            {(isFetching) ? renderLoading() : (error) ? renderError() : (
                <FlatList {...listProps} />
            )}
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
