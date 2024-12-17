import React, { useLayoutEffect, useMemo, useState, useEffect } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator } from 'react-native';

// NAVIGATION
import { useNavigation, useRoute } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { NavButtons, NavBackButton, ErrorView, EmptyView } from "react-native-helper-views";
import { useInfiniteQuery } from '@tanstack/react-query'
import BottomSheet from '@devvie/bottom-sheet';

// HOOKS
// import useFetch from '../hooks/useFetch';

// SERVICES
import { getByCategory } from "../core/Service";

// COMPONENTS
import ModuleItem from "../components/ModuleItem";
import SortBottomView from '../components/SortBottomView';

// CONFIG
import { colors } from '../core/Config';

// NUM OF COLUMNS
const FLATLIST_COLUMNS = 3;

export default function List(props) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // ROUTE PARAMS
    //Access the PARAMS data using:
    const route = useRoute();
    const category = route.params?.category;

    // HOOKS

    // the flatlist defults to 2 columns, to change this, a props can be pased
    const columns = route.params?.columns || FLATLIST_COLUMNS;

    // LOADING STATE AND ERROR
    const {
        data, error, // status
        isFetching, isFetchingNextPage,  //isPending
        isRefetching,
        hasNextPage, 
        fetchNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ['list-data', category],
        queryFn: getData,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            // only attempt to fetch the next page if we viewing a category and the last page has less than the total pages
            return lastPage && lastPageParam < lastPage.total_pages ? lastPageParam + 1 : undefined;
        },
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
            return firstPageParam > 1 ? firstPageParam - 1 : undefined;
        },
    });

    // const [       
    //     { data, error, page, nextPage, totalResults, isFetching, isRefreshing, isFetchingNextPage },
    //     { setData, setError, setPage, setNextPage, setTotalResults, setIsFetching, setIsRefreshing, setLoadingState, setIsFetchingNextPage, setAPIResponse }
    // ] = useFetch();

    //SORT BY - ACTION SHEET REF 
    const sortOptions = [
        {
            id: 1,
            name: "Title (Asc)",
            slug: "title.asc"
        },
        {
            id: 2,
            name: "Title (Desc)",
            slug: "title.desc"
        },
        {
            id: 3,
            name: "Populartity (Asc)",
            slug: "popularity.asc"
        },
        {
            id: 4,
            name: "Populartity (Desc)",
            slug: "popularity.desc"
        }
    ];
    const bottomSheetRef = React.useRef(null);
    const [sortBy, setSortBy] = useState(sortOptions[3])
    
    //========================================================================================
    //1B -NAVIGATION CONFIG - Custom Title and Right Nav Buttons
    useLayoutEffect(() => {
        const navButtons = [
            {
                onPress: () => bottomSheetRef.current?.open(),
                name: "sort",
                type: "font-awesome",
                color: "#fff",
                style: { paddingLeft: 5 }
            }
        ];
        navigation.setOptions({
            headerTitle: category?.name || route.params?.title || "",
            headerRight: () => <NavButtons buttons={navButtons} />,
            headerLeft: () => <NavBackButton onPress={navigation.goBack} />, // If using a custom back button
        });
    }, [navigation]);
    
    //==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    // ==========================================================================================
    //2a - USE EFFECT
    // Refetch the data if the sortBy option changes
    useEffect(() => { refetch() }, [sortBy])

    //2b - GET DATA
    async function getData({ pageParam }) {
        let params = {
            page: pageParam,
            with_genres: category.id
        }

        if (sortBy) params['sort_by'] = sortBy.slug;
        return await getByCategory(category?.media_type, params)
    }

    // 2b - GET DATA
    // async function getData(refresh = false, params = {}, more = false) {
    //     try {
    //         // set the loading state
    //         setLoadingState(!refresh, refresh);
    //         if (!more) setIsFetching(true);

    //         const response = null;

    //         if (category) response = await getWithCategory(pageParam);
    //         else response = await getPanel(panel?.url, { page:pageParam });

    //         // set the data
    //         if (response) setData(response);
    //     } catch (error) {
    //         setError(error.message);
    //     } finally {
    //         setLoadingState(false, false);
    //     }
    // }


    // 2c - REFRESH DATA
    async function refetchData() {
        // setIsRefreshing(true);
        await refetch();
    }

    // 2d - FETCH NEXT PAGE
    // async function fetchNextPage() {
    //     if (hasNextPage) {
    //         setIsFetchingNextPage(true);
    //         await getData(false, true);
    //     }
    // }
    //==============================================================================================
    //3 -  UI ACTION HANDLERS
    //==============================================================================================
    //3a - RENDER ITEM
    const renderItem = ({ item, index }) => {
        return <ModuleItem type={'media-grid'} item={item} size={"medium"} />
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
        return <ErrorView message={error} onPress={() => getData(false)} />
    }

    // 3e - RENDER LOADING
    const renderLoading = () => {
        return <ActivityIndicator style={{ backgroundColor: colors.primary, flex: 1 }} />
    }

    // ==========================================================================================
    //4 -  ACTION HANDLERS
    //==========================================================================================
    // If using Infinite Scroll - Load More Data
    function onEndReached() {
        if (!isFetching && !isFetchingNextPage && hasNextPage) {
            fetchNextPage()
        }
    }

    function onDone(selected){
        setSortBy(selected);
        bottomSheetRef.current?.close()
    }

    // ==========================================================================================
    // 5 - VIEW PROPS
    //==========================================================================================    
    //5a - FLATLIST PROPS
    const listData = useMemo(() => {
        return data && data.pages.map(page => {
            return page?.results || [];
        }).flat()
    }, [data]);
    
    const listProps = {
        data: listData,
        extraData: listData,
        initialNumToRender: 10,
        numColumns: columns,

        style: { backgroundColor: colors.primary },
        contentContainerStyle: { flexGrow: 1 },

        renderItem: renderItem,
        ListEmptyComponent: renderEmpty,

        keyExtractor: (item, index) => `item_${item['id'].toString()}${index.toString()}`,
        refreshing: isRefetching,
        onRefresh: refetchData,

        // If using Infinite Scroll
        onEndReached,
        onEndReachedThreshold: 0,
        ListFooterComponent: renderFooter
    }

    // ==========================================================================================
    // 6 - RENDER VIEW
    //==========================================================================================
    return (
        <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
            {(isFetching && !isFetchingNextPage) ? renderLoading() : (error) ? renderError() : (
                <FlatList {...listProps} />
            )}
            <BottomSheet ref={bottomSheetRef} onClose={null} style={{ backgroundColor: colors.primary }} height={"55%"}>
                <SortBottomView onDone={onDone} sortOptions={sortOptions} initialValue={sortBy}/>
            </BottomSheet>
        </SafeAreaView>
    );
};