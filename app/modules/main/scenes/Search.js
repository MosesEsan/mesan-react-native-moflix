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
        { data, error, page, nextPage, totalResults, isFetching, isRefreshing, isFetchingNextPage },
        { setData, setError, setPage, setNextPage, setTotalResults, setIsFetching, setIsRefreshing, setIsFetchingNextPage, setAPIResponse }
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
            setIsFetchingNextPage(false)
        }
    }

    // 2c - FETCH NEXT PAGE
    function fetchNextPage() {
        if (nextPage) {
            setIsFetchingNextPage(true);
            search(searchValue, nextPage, more = true);
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
        return isFetchingNextPage ? (
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
    const onEndReached = () => (!isFetching && !isFetchingNextPage && nextPage) && fetchNextPage()

    // ON CLOSE
    const onClose = () => {
        navigation.goBack();
    }

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
            <SearchBarContainer searchValue={searchValue} onChangeText={setSearchValue} onClose={onClose} />
            {/* //If using Flatlist */}
            {(isFetching && !isFetchingNextPage) && renderLoading()}
            {(error) && renderError()}
            {(!isFetching && !error) && <FlatList {...listProps} />}
        </SafeAreaView>
    );
};

const SearchBarContainer = ({ searchValue, onChangeText, onClose }) => {
    return (
        <View style={{ flexDirection: "row" }}>
            <SearchBar
                value={searchValue}
                placeholder="Type Here..."
                onChangeText={onChangeText}
                placeholderTextColor={"#fff"}
                inputStyle={styles.inputStyle}
                containerStyle={styles.containerStyle}
                inputContainerStyle={styles.inputContainerStyle}
                showCancel={true}
                autoFocus={false} />
            <Pressable onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
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
        height: 34,
        borderRadius: 10,
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