import React, { useLayoutEffect, useMemo, useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, StyleSheet, View, ScrollView, Platform, RefreshControl } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import axios from 'axios';
import { EmptyView, ErrorView, CustomNavTitle } from "react-native-helper-views";
import { PanelContainer } from "mesan-react-native-panel";
import { SearchBar } from '@rneui/themed';

// HOOKS
import useFetch from '../hooks/useFetch';

// SERVICES
import { getAllCategories, searchByName } from "../core/Service";

// COMPONENTS
import ModuleItem from "../components/ModuleItem";

// CONFIG
import { colors } from "../core/Config";

export default function Search(props) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // LOADING STATE AND ERROR
    const [searchValue, setSearchValue] = useState("");
    const [searchType, setSearchType] = useState(null);
    const [cancelToken, setCancelToken] = useState('');
    const [categories, setCategories] = useState([]);

    const [       
        { data, error, page, nextPage, totalResults, isFetching, isRefreshing, isFetchingNextPage },
        { setData, setError, setPage, setNextPage, setTotalResults, setIsFetching, setIsRefreshing, setLoadingState, setIsFetchingNextPage, setAPIResponse }
    ] = useFetch();

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
        (async () => await _getCategories())();
    }, []);

    // 2A - USE EFFECT - SEARCH
    useEffect(() => {
        if (searchValue.length > 0) (async () => await search(searchValue, page))();
        else setData([]);
    }, [searchValue]);

    // 2B - GET CAEGORIES
    async function _getCategories(refresh=false, params = {}) {
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
            let params = { page, query, cancelToken: cancelToken.token, "primary_release_date.lte": "31-12-2024" }

            // Determine the slug to use
            let paramSlug = searchType ? searchType.slug : 'multi';
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
        await _getCategories(true);
    }

    // 2D - FETCH NEXT PAGE
    async function fetchNextPage() {
        if (nextPage) {
            setIsFetchingNextPage(true);
            await search(searchValue, nextPage, more = true);
        }
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

    // LIST DATA
    const listData = useMemo(() => {
        if (searchValue.length === 0) return categories
        return data;
        // return data && data.pages.map(page => {
        //     if (page?.results) return page.data;
        //     return []
        // }).flat()
    }, [searchValue, data, categories])

    //==============================================================================================
    //5 -  UI ACTION HANDLERS
    //==============================================================================================
    //3a - RENDER ITEM
    const renderItem = ({ item, index }) => {
        let type = (searchValue.length === 0) ? 'category-grid' : 'media-grid';
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
        return <ErrorView message={error} onPress={search} />
    }

    // 3e - RENDER LOADING
    const renderLoading = () => {
        return <ActivityIndicator style={{ backgroundColor: colors.primary, flex: 1 }} />
    }

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
    // 5 - VIEW PROPS
    //==========================================================================================
    //5a - FLATLIST PROPS
    const listProps = {
        data: listData,
        extraData: listData,
        initialNumToRender: 10,
        numColumns: 3,

        style: { backgroundColor: colors.primary },
        contentContainerStyle: { flexGrow: 1, paddingHorizontal:10},

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
        contentContainerStyle: { flexGrow: 1,  }
    }

    // ==========================================================================================
    // 6 - RENDER VIEW
    //==========================================================================================
    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: colors.primary }]}>
            <SearchBarContainer searchValue={searchValue} onChangeText={setSearchValue} onClose={onClose} placeholder={"Search by title"} />
            {(isFetching && !isFetchingNextPage) && renderLoading()}
            {(error) && renderError()}
            {renderView()}
        </SafeAreaView>
    );
};

const SearchBarContainer = ({ searchValue, onChangeText, onClose, placeholder = "Type Here..." }) => {
    return (
        <View style={{ flexDirection: "row", paddingHorizontal: 4 }}>
            <SearchBar
                value={searchValue}
                placeholder={placeholder}
                onChangeText={onChangeText}
                placeholderTextColor={"#fff"}
                inputStyle={styles.inputStyle}
                containerStyle={{flex: 1, backgroundColor: colors.primary, borderTopWidth:0, borderBottomWidth:0}}
                inputContainerStyle={styles.inputContainerStyle}
                showCancel={true}
                autoFocus={false} />
            {/* <Pressable onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
            </Pressable> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },

    containerStyle: {
        flex: 1,
        backgroundColor: "#000",
        paddingVertical: 6,
    },

    inputContainerStyle: {
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgb(28,28,31)"
    },

    inputStyle: {
        color: "#fff",
        minHeight: 34,
        fontSize: 16,
    },

    cancelButton: {
        width: 60,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8
    },

    cancelText: {
        color: "#fff",
        fontWeight: "6i00"
    }
});