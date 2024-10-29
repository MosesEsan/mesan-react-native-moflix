import React, { useLayoutEffect, useMemo } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator } from 'react-native';

// NAVIGATION
import { useNavigation, useRoute } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { NavBackButton, ErrorView, EmptyView } from "react-native-helper-views";
import { useInfiniteQuery } from '@tanstack/react-query'

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
const FLATLIST_COLUMNS = 3;

// STYLES
// import { styles } from "../styles";

export default function List(props) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // HOOKS
    // if using Panels and/or Sections
    // Get the section from the Context
    const { section } = useModuleContext();

    // ROUTE PARAMS
    //Access the PARAMS data using:
    const route = useRoute();
    // if displaying the data for a specific panel
    const panel = route.params?.panel;

    // if displaying the data for a specific category
    const category = route.params?.category;

    // if an array of data is passed as a prop
    const item = route.params?.item;

    // The scene is used as the ModuleItem type
    const scene = route.params?.type;

    // the flatlist defults to 2 columns, to change this, a props can be pased
    const columns = (panel && panel?.item_type === "category") ? 2  : route.params?.columns || FLATLIST_COLUMNS;

    // LOADING STATE AND ERROR
    const {
        data, error, // status
        isFetching, isFetchingNextPage, //isPending
        hasNextPage, fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ['list-data', section, category, panel, scene],
        queryFn: getData,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            // only attempt to fetch the next page if we viewing a category and the last page has less than the total pages
            if (!category) return undefined
            return lastPage && lastPageParam < lastPage.total_pages ? lastPageParam + 1 : undefined;
        },
        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
            return firstPageParam > 1 ? firstPageParam - 1 : undefined;
        },
    });

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
    //2b - GET DATA
    async function getData({ pageParam }) {
        if (category) return await getWithCategory(pageParam);
        else if (scene === "episodes") return await getEpisodes(); 
        else return await getPanel(panel?.url, { page:pageParam });
    }

    // 2c - GET DATA BY CATEGORY
    async function getWithCategory(page) {
        let params = {
            "primary_release_date.lte": "31-12-2024",
            page: page,
            with_genres: category.id
        }
        return await getByCategory(section.slug, params)
    }

    // 2d - GET EPISODES
    async function getEpisodes() {
        const series_id = route.params?.series_id;
        const season_number = route.params?.season_number;
        if (!series_id || !season_number) {
            alert("Unable to get episodes", "Missing required parameters");
            navigation.goBack();
        }
        return await getSeasonEpisodes(series_id, season_number);
    }

    //==============================================================================================
    //3 -  UI ACTION HANDLERS
    //==============================================================================================
    //3a - RENDER ITEM
    const renderItem = ({ item, index }) => {
        // if displaying the data for a specific panel and the panel media_type is "category"
        // render the GridCategoryItem
        // alert(JSON.stringify(JSON.stringify(panel)))
        if (panel && panel?.item_type === "category") return <ModuleItem type={'category-grid'} item={item} />

        if (scene) return <DetailItem type={scene} item={item} />
        
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
        return hasNextPage && isFetchingNextPage ? (
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
    let onEndReached = () => !isFetching && fetchNextPage()

    const listData = useMemo(() => {
        return data && data.pages.map(page => {
            // if the pages has the key results use it else check for the key episodes 
            // if the key is episodes, use it else return the data
            if (page?.results) return page.results;
            if (page?.episodes) return page.episodes;
            if (page?.genres) return page.genres;
            return []
        }).flat()
    }, [data])

    // ==========================================================================================
    // 5 - VIEW PROPS
    //==========================================================================================
    //5a - FLATLIST PROPS
    const listProps = {
        // data: data.pages.map(page => page.results).flat(),
        // extraData: data.pages.map(page => page.results).flat(),
        initialNumToRender: 10,
        numColumns: columns,

        style: { backgroundColor: colors.primary },
        contentContainerStyle: { flexGrow: 1 },

        renderItem: renderItem,
        ListEmptyComponent: renderEmpty,

        keyExtractor: (item, index) => `item_${item['id'].toString()}${index.toString()}`,
        refreshing: isRefreshing,
        onRefresh: () => getData(true),

        // If using Infinite Scroll
        onEndReached,
        onEndReachedThreshold: 0,
        ListFooterComponent: renderFooter
    }

    // ==========================================================================================
    // 6 - RENDER VIEW
    //==========================================================================================
    if (isFetching && !isFetchingNextPage) return renderLoading();
    if (error) return renderError();
    return (
        <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
            {/* //If using Flatlist */}
            <FlatList {...listProps} data={listData} extraData={listData} />
        </SafeAreaView>
    );
};