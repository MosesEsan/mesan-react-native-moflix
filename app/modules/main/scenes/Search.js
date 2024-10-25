import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, SafeAreaView, ActivityIndicator, FlatList, StyleSheet, View, Pressable, Platform } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { EmptyView, ErrorView, CustomNavTitle } from "react-native-helper-views";
import { SearchBar } from '@rneui/themed';
import axios from 'axios';

// HOOKS
import useFetch from '../hooks/useFetch';

// SERVICES
import { searchByName } from "../core/Service";

// COMPONENTS
import ModuleItem from "../components/ModuleItem";

// CONFIG
import { colors } from "../core/Config";

export default function SceneName(props) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // LOADING STATE AND ERROR
    // const [error, setError] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [searchType, setSearchType] = useState(null);
    const [cancelToken, setCancelToken] = useState('');

    const [
        { data, error, page, nextPage, totalResults, isFetching, isRefreshing, isFetchingMore }, 
        { setData, setError, setPage, setNextPage, setTotalResults, setIsFetching, setIsRefreshing, setIsFetchingMore, setAPIResponse }
    ] = useFetch();

    //==================================================================================================
    //1B -NAVIGATION CONFIG
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerStyle: { backgroundColor: "#000", borderBottomColor: "rgb(18,18,20)", shadowColor: "rgb(26,26,26)" },
            // headerLeft: () => <CustomNavTitle title={"Search"} style={{ flex: 1, width: 200 }} titleStyle={{ color: "#fff" }} />,
        });
    }, [navigation]);

    // ==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    useEffect(() => {
        if (searchValue.length > 0) (async () => await search(searchValue, page))();
        else setData([]);
    }, [searchValue]);

    //2b - GET DATA
    async function search(query, page = 1, more = false) {
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
            setIsFetchingMore(false)
        }
    }

    // 2c - FETCH NEXT PAGE
    function fetchNextPage() {
        if (nextPage) {
            setIsFetchingMore(true);
            search(searchValue, nextPage, more=true);
        }
    }

    //==============================================================================================
    //3 -  UI ACTION HANDLERS
    //==============================================================================================
    //3a - RENDER ITEM
    const renderItem = ({ item, index }) => {
        return <ModuleItem type={'media-grid'} item={item} />
    }

    //3b - RENDER EMPTY
    const renderEmpty = () => {
        let props = { color: colors.text }
        let textProps = { titleStyle: props, textStyle: props }
        return <EmptyView title={"No Data."} message={"No data to show"} {...textProps} />
    };

    //3c - RENDER FOOTER
    const renderFooter = () => {
        return isFetchingMore ? (
            <ActivityIndicator size="small" color={colors.text} style={{ height: 50 }} />
        ) : null;
    };

    //3d - RENDER HEADER
    const renderHeader = () => {
        return (
            <View> <Text>HEADER</Text></View>
        )
    };

    // 3e - RENDER ERROR
    const renderError = () => {
        return <ErrorView message={error} onPress={search} />
    }

    // 3f - RENDER LOADING
    const renderLoading = () => {
        return <ActivityIndicator style={{ backgroundColor: colors.primary, flex: 1 }} />
    }

    // ==========================================================================================
    //4 -  ACTION HANDLERS
    //==========================================================================================
    // If using Infinite Scroll - Load More Data
    let onEndReached = () => (!isFetching && !isFetchingMore && nextPage) && fetchNextPage()

    // ==========================================================================================
    //==========================================================================================
    const listProps = {
        data: data,
        extraData: data,
        initialNumToRender: 10,
        numColumns: 3,

        style: { backgroundColor: colors.primary },
        contentContainerStyle: { flexGrow: 1 },

        renderItem: renderItem,
        ListEmptyComponent: renderEmpty,

        keyExtractor: (item, index) => `item_${item['id'].toString()}${index.toString()}`,

        // If using Infinite Scroll
        onEndReached,
        onEndReachedThreshold: 0,
        ListFooterComponent: renderFooter
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <SearchBar
                value={searchValue} 
                placeholder="Type Here..." 
                onChangeText={setSearchValue}
                placeholderTextColor={"#fff"}
                inputStyle={styles.inputStyle}
                containerStyle={styles.containerStyle}
                inputContainerStyle={styles.inputContainerStyle} 
                showCancel={true}
                autoFocus={false} />
            {/* //If using Flatlist */}
            {(isFetching && !isFetchingMore) && renderLoading()}
            {(error) && renderError()}
            {(!isFetching && !error) && <FlatList {...listProps} />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },

    containerStyle: {
        backgroundColor: "#000",
        padding: 12
    },

    inputContainerStyle: {
        height: 44, 
        borderRadius: 10,
        backgroundColor: "rgb(28,28,31)"
    },

    inputStyle: {
        color: "#fff",
    }
});



