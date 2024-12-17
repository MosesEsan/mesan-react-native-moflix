import React, { useLayoutEffect, useMemo, useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, StyleSheet, View, ScrollView, Platform, RefreshControl, useWindowDimensions, Text } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import axios from 'axios';
import { EmptyView, ErrorView, CustomNavTitle } from "react-native-helper-views";
import { PanelContainer } from "mesan-react-native-panel";

// HOOKS
import useFetch from '../hooks/useFetch';

// SERVICES
import { getAllCategories, searchByName } from "../core/Service";

// COMPONENTS
import ModuleItem from "../components/ModuleItem";
import SearchBarContainer from '../components/SearchBarContainer';

// CONFIG
import { colors } from "../core/Config";

export default function Search(props) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // LOADING STATE AND ERROR
    const [searchValue, setSearchValue] = useState("");
    const [cancelToken, setCancelToken] = useState('');
    const [categories, setCategories] = useState([]);

    const [
        { data, error, page, nextPage, totalResults, isFetching, isRefreshing, isFetchingNextPage },
        { setData, setError, setPage, setNextPage, setTotalResults, setIsFetching, setIsRefreshing, setLoadingState, setIsFetchingNextPage, setAPIResponse }
    ] = useFetch();

    //FILTER OPTIONS
    const FILTERS = [
        { id: 1, name: "All", slug:"multi" },
        { id: 2, name: "Movies", slug:"movie" },
        { id: 3, name: "TV Show", slug:"tv"  },
        { id: 4, name: "People", slug:"person"  }
    ]
    const [searchFilter, setSearchFilter] = useState(FILTERS[0]);

    //==================================================================================================
    //1B -NAVIGATION CONFIG
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => <CustomNavTitle title={"Search"} style={{ width: 200, paddingLeft: 14 }} titleStyle={{ color: colors.text, fontSize: 21 }} />,
        });
    }, [navigation]);

    //==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    // ==========================================================================================
    // 2A - USE EFFECT - GET CATEGORIES
    useEffect(() => {
        (async () => await getCategories())();
    }, []);

    // 2A - USE EFFECT - SEARCH
    useEffect(() => {
        if (searchValue.length > 0) (async () => await search(searchValue, page))();
        else {
            // Reset the page number and the selected filter and data
            setPage(1);
            setSearchFilter(FILTERS[0])
            setData([]);
        }
    }, [searchValue, searchFilter]);

    // 2B - GET CAEGORIES
    async function getCategories(refresh = false, params = {}) {
        try {
            // set the loading state
            setLoadingState(!refresh, refresh);

            let response = await getAllCategories(params);
            const panels = Object.entries(response).map(([key, data]) => {
                // convert the key to title case
                let title = key.replace(/\b\w/g, l => l.toUpperCase());
                return ({ title: `${title} Categories`, data, type: "grid" })
            });
            setCategories(panels || [])
        } catch (error) {
            setError(error.message);
        } finally {
            setLoadingState(false, false);
            setIsFetchingNextPage(false);
        }
    }

    //2B - GET DATA
    async function search(query = searchValue, page = 1, more = false) {
        if (!more) setIsFetching(true);

        // Cancel the previous request before making a new request
        if (cancelToken) cancelToken.cancel('Operation canceled by the user.');

        // Create a new CancelToken
        let cancelToken_ = axios.CancelToken.source();
        setCancelToken(cancelToken_);

        try {
            let params = { page, query, cancelToken: cancelToken.token }

            // Determine the slug to use
            let paramSlug = searchFilter ? searchFilter.slug : 'multi';
            let response = await searchByName(paramSlug, params);
            setAPIResponse(response, { page: "page", total_results: "total_results", total_pages: "total_pages", data: "results" });
        } catch (error) {
            if (!axios.isCancel(error)) setError(error.message);
        } finally {
            setIsFetching(false)
            setIsFetchingNextPage(false)
        }
    }

    // 2C - REFRESH DATA
    async function refetchData() {
        setIsRefreshing(true);
        await getCategories(true);
    }

    // 2D - FETCH NEXT PAGE
    async function fetchNextPage() {
        if (nextPage) {
            setIsFetchingNextPage(true);
            await search(searchValue, nextPage, true);
        }
    }

    //==============================================================================================
    //3 -  UI ACTION HANDLERS
    //==============================================================================================
    //3a - RENDER ITEM
    const renderItem = ({ item, index }) => {
        let type = 'category-grid';
        if (searchValue.length > 0){
            type = searchFilter && searchFilter?.slug === "person" ? "person-grid" :  'media-grid';
        }
        return <ModuleItem type={type} item={item} key={`search_item_${index}`} />
    }

    //3b - RENDER EMPTY
    const renderEmpty = () => {
        let props = { color: colors.text }
        let textProps = { titleStyle: props, textStyle: props }
        return <EmptyView title={"No Data."} message={"No data to show"} {...textProps} />
    };

    //3c - RENDER FOOTER
    const renderFooter = () => {
        return isFetchingNextPage ? (
            <ActivityIndicator size="small" color={colors.text} style={{ height: 50 }} />
        ) : null;
    };

    // 3d - RENDER ERROR
    const renderError = () => {
        const onPress = searchValue.length === 0 ? getCategories : search;
        return <ErrorView message={error} onPress={onPress} titleStyle={{ color: "#fff" }} />
    }

    // 3e - RENDER LOADING
    const renderLoading = () => {
        return <ActivityIndicator style={{ backgroundColor: colors.primary, flex: 1 }} />
    }

    const LazyPlaceholder = ({ route }) => (
        <View style={styles.scene}>
            <Text>Loading {route.title}…</Text>
        </View>
    );


    // 3f - RENDER VIEW
    const renderView = () => {
        if (!isFetching && !error) {
            if (searchValue.length === 0) {
                return (
                    <ScrollView {...scrollViewProps}>
                        <PanelContainer data={panels} />
                    </ScrollView>
                )
            }
            return <FlatList {...listProps} />;
        }
        return null;
    }

    // ==========================================================================================
    //4 -  ACTION HANDLERS
    //==========================================================================================
    // If using Infinite Scroll - Load More Data
    function onEndReached() {
        if (!isFetching && !isFetchingNextPage && nextPage) {
            fetchNextPage()
        }
    }

    // ON CLOSE
    const onClose = () => {
        navigation.goBack();
    }

    //ON FILTER SELECTED
        // ON FILTER ITEM SELECTED
        function onFilterSelected(selected) {
            //RESET THE PAGE TO 1 AND SET THE SELETED FILTER
            setPage(1);
            setSearchFilter(selected);
        };

    // ==========================================================================================
    // 5 - VIEW PROPS
    //==========================================================================================
    //5a - FLATLIST PROPS
    // LIST DATA
    const listData = useMemo(() => {
        if (searchValue.length === 0) return categories
        return data;
    }, [searchValue, data, categories])

    const listProps = {
        data: listData,
        extraData: listData,
        initialNumToRender: 10,
        numColumns: 3,

        style: { backgroundColor: colors.primary },
        contentContainerStyle: { flexGrow: 1, paddingHorizontal: 10 },

        renderItem: renderItem,
        ListEmptyComponent: renderEmpty,

        keyExtractor: (item, index) => `item_${item['id'].toString()}${index.toString()}`,

        // If using Infinite Scroll
        onEndReached,
        onEndReachedThreshold: 0,
        ListFooterComponent: renderFooter
    }

    //5b - PANEL PROPS
    const panels = useMemo(() => {
        const sharedPanelProps = {
            containerStyle: { marginBottom: 15 },
            headerStyle: { color: colors.text, fontWeight: "500" },
            ctaTextStyle: { color: colors.text },
            // onPress: onPanelViewAllPress,
            renderItem,
        }
        return categories.map(panel => ({ ...panel, ...sharedPanelProps }));
    }, [categories, searchValue]);

    //5c - SCROLLVIEW PROPS
    const refreshControl = <RefreshControl refreshing={isRefreshing} onRefresh={refetchData} />
    const scrollViewProps = {
        horizontal: false,
        showsHorizontalScrollIndicator: false,
        refreshControl: refreshControl,
        contentContainerStyle: { flexGrow: 1 }
    }

    //5d - SEARCH PROPS
    const searchBarProps = {
        searchValue,
        onChangeText: setSearchValue,
        onClose: onClose,
        placeholder: "Search by title",
        filters: FILTERS,
        filter:searchFilter,
        onFilterSelected: onFilterSelected,
        showFilter: searchValue.length > 0,
        // onSortByPress: () => alert("sort")
    };

    // ==========================================================================================
    // 6 - RENDER VIEW
    //==========================================================================================
    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: colors.primary }]}>
            <SearchBarContainer {...searchBarProps} />
            {(isFetching && !isFetchingNextPage) ? renderLoading() : (error) ? renderError() : (
                renderView()
            )}
        </SafeAreaView>
    );
};