import React, { useLayoutEffect } from 'react';
import { SafeAreaView, FlatList } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { ErrorView, EmptyView, CustomNavTitle } from "react-native-helper-views";

// SERVICES
import { } from "../core/Service";

// HOOKS
import { useFavoriteContext } from "../providers/FavoriteProvider";

// COMPONENTS
import ModuleItem from "../components/ModuleItem";

// CONFIG
import { colors } from '../core/Config';

// NUM OF COLUMNS
const FLATLIST_COLUMNS = 3;


export default function Favorites(props) {
        // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // HOOKS
    // Get the favorites from the Context
    const { favorites } = useFavoriteContext();

    //========================================================================================
    //1B -NAVIGATION CONFIG - Custom Title and Right Nav Buttons
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => <CustomNavTitle title={"Favorites"} style={{ width: 150, paddingLeft: 14 }} titleStyle={{ color: colors.text, fontSize: 21 }} />,
        });
    }, [navigation]);

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
    // const renderFooter = () => {
    //     return isFetchingNextPage ? (
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
    // 5 - VIEW PROPS
    //==========================================================================================
    //5a - FLATLIST PROPS
    const listProps = {
        data: favorites,
        extraData: favorites,
        initialNumToRender: 10,
        numColumns: FLATLIST_COLUMNS,

        style: { backgroundColor: colors.primary },
        contentContainerStyle: { flexGrow: 1 },

        renderItem: renderItem,
        ListEmptyComponent: renderEmpty,

        keyExtractor: (item, index) => `item_favorite${index.toString()}`
    }

    // ==========================================================================================
    // 6 - RENDER VIEW
    //==========================================================================================
    return (
        <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
            {(isFetching && !isFetchingNextPage) ? renderLoading() : (error) ? renderError() : (
                <FlatList {...listProps} />
            )}
        </SafeAreaView>
    );
};