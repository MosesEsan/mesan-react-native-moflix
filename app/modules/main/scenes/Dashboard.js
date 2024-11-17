import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { SafeAreaView, ActivityIndicator, ScrollView, RefreshControl, StyleSheet } from 'react-native';

// NAVIGATION
// useRoute
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { FilterView } from "react-native-filter-component";
import { PanelContainer } from "mesan-react-native-panel";
import { ErrorView, NavButtons, CustomNavTitle } from "react-native-helper-views";

// HOOKS
import useFetch from '../hooks/useFetch';
import { useModuleContext } from "../core/Provider";

// SERVICES
import { getSections, getPanels } from "../core/Service";

// COMPONENTS
import ModuleItem from "../components/ModuleItem";

// CONFIG
import { colors } from "../core/Config"

// STYLES
// import { styles } from "../styles";

export default function Dashboard({ }) {
    //1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // HOOKS
    // Get the current section from the Context
    const { section, setSection, sections, setSections } = useModuleContext();

    // LOADING STATE AND ERROR
    const [
        //page, nextPage, totalResults, isFetchingNextPage
        { data, error, isFetching, isRefreshing },
        //  setPage, setNextPage, setTotalResults, setIsFetchingNextPage, setAPIResponse
        { setData, setError, setIsFetching, setIsRefreshing, setLoadingState }
    ] = useFetch();

    //========================================================================================
    //1B -NAVIGATION CONFIG - Custom Title and Right Nav Buttons
    // COMMENT OUT IF USING AS A NESTED SCREEN
    // OR LEAVE UNCOMMENTED IF USING AS A MAIN SCREEN OR WANT TO OVERRIDE THE NAVIGATION CONFIG
    useLayoutEffect(() => {
        const navButtons = [
            {
                onPress: () => navigation.navigate('Search'),
                name: "search",
                type: "ionicon",
                color: "#fff",
                style: { paddingLeft: 5 }
            },
            {
                onPress: () => navigation.navigate('Favorites'),
                name: "favorite",
                type: "fontisto",
                color: "#fff",
                size: 20,
                style: { paddingLeft: 5 }
            }
        ];
        navigation.setOptions({
            // headerTitle: section?.name || "Dashboard",
            headerTitle: "",
            // if using a a nested screen in the Home scene   
            // headerLeft: () => <NavBackButton onPress={() => navigation.goBack()} />,
            // headerRight: () => <NavButtons buttons={navButtons} />,

            // if not using a a nested screen in the Home scene
            // or using this component as standalone screen or overriding the navigation config
            headerLeft: () => <CustomNavTitle title={"MoFlix"} style={{ width: 200, paddingLeft: 14 }} titleStyle={{ color: colors.text, fontSize: 21 }} />,
            headerRight: () => <NavButtons buttons={navButtons} />,
        });
    }, [navigation]);

    //==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    // ==========================================================================================
    useEffect(() => {
        //if (isLoggedIn) await getData()
        (async () => await getDashbordSections())();
    }, []); //}, [isLoggedIn])

    useEffect(() => {
        (async () => {
            if (section) await getData();
        })();
    }, [section]);

    //2b - GET SECTIONS - OPTIONAL
    async function getDashbordSections() {
        try {
            // set the loading state
            setIsFetching(true);

            // get the sections
            let response = await getSections();

            // set the sections and the first section as the selected section
            setSections(response?.data || []);
            setSection(response ? response.data[0] : null)
        } catch (error) {
            setError(error.message);
        } finally {
            setLoadingState(false, false);
        }
    }

    // 2c - GET DATA
    async function getData(refresh = false, params = {}) {
        try {
            // set the loading state
            setLoadingState(!refresh, refresh);

            // pass the selected section to the params instead
            if (section) params = { ...params, 'section_id': section.id }
            let response = await getPanels(params)

            // set the data
            setData(response?.panels || []);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoadingState(false, false);
        }
    }

    // 2c - REFRESH DATA
    async function refetchData() {
        setIsRefreshing(true);
        await getData(true);
    }

    // 2d - FETCH NEXT PAGE
    async function fetchNextPage() {
        if (nextPage) {
            setIsFetchingNextPage(true);
            await getData(false, more = true);
        }
    }

    //===========================================================================================
    //3 - UI ACTION HANDLERS
    //==========================================================================================
    //3a - RENDER PANEL ITEM
    const renderPanelItem = ({ item, index, panel }) => {
        return <ModuleItem type={panel?.item_type} item={item} />
    };

    // 3d - RENDER ERROR
    const renderError = () => {
        return <ErrorView message={error} onPress={getData} />
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

    // 4B - ON PANEL VIEW ALL PRESS
    function onPanelViewAllPress(panel) {
        //  check type of panel and transition to the appropriate screen
        navigation.navigate('List', { panel });
    }

    // ========================================================================================
    // 5 - VIEW PROPS
    //=========================================================================================
    //5a - PANEL DATA
    const panels = useMemo(() => {
        const sharedPanelProps = {
            containerStyle: { marginBottom: 15 },
            headerStyle: { color: colors.text, fontWeight: "500" },
            ctaTextStyle: { color: colors.text },
            onPress: onPanelViewAllPress,
            renderItem: renderPanelItem
        }
        return data.map(panel => ({ ...panel, ...sharedPanelProps }));
    }, [data]);

    //5b - FILTER VIEW PROPS
    const filterViewProps = {
        data: sections,
        initialIndex: 0,
        onItemPress: onSectionSelected,
        containerStyle: { backgroundColor: "transparent" },
        headerStyle: { color: colors.text },
        ctaStyle: { color: colors.text },
        selectedStyle: { backgroundColor: colors.secondary },
        selectedTextStyle: { color: colors.text },
        ...filterViewStyles,
    }

    //5c - SCROLLVIEW PROPS
    const refreshControl = <RefreshControl refreshing={isRefreshing} onRefresh={refetchData} />
    const scrollViewProps = {
        horizontal: false,
        showsHorizontalScrollIndicator: false,
        refreshControl: refreshControl,
        contentContainerStyle: { flexGrow: 1 },
    }
    // ========================================================================================
    // 6 - RENDER VIEW
    //=========================================================================================
    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: colors.primary }]}>
            {/* If using the the filter view */}
            <FilterView {...filterViewProps} />
            {(isFetching) ? renderLoading() : (error) ? renderError() : (
                <ScrollView {...scrollViewProps}>
                    <PanelContainer data={panels} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const filterViewStyles = StyleSheet.create({
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
});