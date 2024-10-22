import React, { useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, ActivityIndicator, ScrollView, RefreshControl, StyleSheet } from 'react-native';

// NAVIGATION
import { useNavigation, useRoute } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import Panel from "mesan-react-native-panel";
import { EmptyView, ErrorView, NavBackButton, NavButtons, CustomNavTitle, useCRUD } from "react-native-helper-views";

// PROVIDERS
import { useModuleContext } from "../core/Provider";

// SERVICES
import { getDashboard } from "../core/Service";

// COMPONENTS
import ModuleItem from "../components/ModuleItem";

// CONFIG
import { colors } from "../core/Config"

// STYLES
// import { styles } from "../styles";

export default function Dashboard({}) {
    // 0 - NAVIGATION PROVIDER
    const navigation = useNavigation();
    const route = useRoute();

    // Get the current section from the Context
    const { section } = useModuleContext();

    // If the section was passed as a Route parameter
    // const section = route.params?.section;

    //1 - DECLARE VARIABLES
    const {
        data, error,
        isFetching, isRefreshing,
        setLoading, resetLoadingState, setData, setError
    } = useCRUD([])

    //========================================================================================
    //1B -NAVIGATION CONFIG - Custom Title and Right Nav Buttons
    // COMMENT OUT IF USING AS A NESTED SCREEN
    // OR LEAVE UNCOMMENTED IF USING AS A MAIN SCREEN OR WANT TO OVERRIDE THE NAVIGATION CONFIG
    const navButtons = [
        {
            onPress: () => navigation.navigate('Search'),
            name: "search",
            type: "ionicon",
            color: "#fff",
            style: { paddingLeft: 5 }
        },
        {
            onPress: () => navigation.navigate('Filter'),
            name: "calendar-outline",
            type: "ionicon",
            color: "#fff",
            style: { paddingLeft: 5 }
        }
    ];

    useLayoutEffect(() => {
        navigation.setOptions({
            // headerTitle: section?.name || "Dashboard",
            // if using a a nested screen in the Home scene   
            // headerLeft: () => <NavBackButton onPress={() => navigation.goBack()} />,
            // headerRight: () => <NavButtons buttons={navButtons} />,

            // if not using a a nested screen in the Home scene
            // or using this component as standalone screen or overriding the navigation config
            headerLeft: () => <CustomNavTitle title={"MoFlix"} style={{width: 200}} titleStyle={{color: colors.text}}/>,
        });
    }, [navigation]);

    //==========================================================================================
    // 2 - MAIN CODE BEGINS HERE
    // ==========================================================================================
    useEffect(() => {
        (async () => await getData())();
        //    }, []);
        // If using as a nested screen in the Home scene, listen for changes in the selected section
    }, [section]);

    // useEffect(() => {
    //     (async () => {
    //         if (isLoggedIn) await getData()
    //     })();
    // }, [isLoggedIn])

    //2b - GET DATA
    async function getData(refresh = false, params = {}) {
        // If not refreshing, empty the data array - OPTIONAL
        if (!refresh) setData([])

        setLoading(true, refresh);

        try {
            // pass the selected section to the params instead
            if (section) params = { ...params, 'section': section.id }
            let response = await getDashboard(params)
            onCompleted(response);
        } catch (error) {
            alert(error.message)
            onError(error);
        }
    }

    //===========================================================================================
    //3 - API RESPONSE HANDLERS
    // ===========================================================================================
    function onCompleted(data) {
        setData(data);

        //If not using Provider
        setError(null);
        resetLoadingState()
    }

    function onError(error) {
        setError(error.message)
        //If not using Provider
        resetLoadingState()
    }
    //==============================================================================================
    //4 -  UI ACTION HANDLERS
    //==========================================================================================
    //4a - RENDER PANEL ITEM
    const renderPanelItem = ({ item, index, panel }) => {
        const { item_type } = panel;

        return <ModuleItem type={item_type} item={item}/>
    };
    
    // ==========================================================================================
    //5 -  ACTION HANDLERS
    //==========================================================================================
    function onPanelViewAllPress(panel) {
        //  check type of panel and transition to the appropriate screen
        navigation.navigate('List', { panel: panel });
    }

    // ==========================================================================================
    // 6 - RENDER VIEW
    //==========================================================================================
    const dashboardProps = {
        isFetching, isRefreshing, error, data,
        onRefresh: () => getData(true),
    }
    return (
        <DashboardContainer {...dashboardProps} style={{backgroundColor: colors.primary}}>
            {
                data.map((panel, index) => {
                    let panelType = panel.type === "carousel-medium" || panel.type === "carousel-large" ? "carousel" : panel.type;
                    return (
                        <Panel
                            key={`panel_${index}`}
                            {...panel}
                            type={panelType}
                            containerStyle={{ marginBottom: 15 }}
                            ctaContainerStyle={{}}
                            ctaTextStyle={{color: colors.text}}
                            headerStyle={{color: colors.text, fontWeight: "500"}}
                            onPress={panel.cta ? () => onPanelViewAllPress(panel) : null}
                            renderItem={({ item, index }) => renderPanelItem({ item, index, panel })}
                        />
                    )
                })
            }
        </DashboardContainer>
    );
};

function DashboardContainer({ isFetching, isRefreshing, error, data, onRefresh, children, style }) {
    const renderScrollViewContent = () => {
        if (isFetching) return <ActivityIndicator style={[{ flex: 1 }]} />;

        if (error) return <ErrorView message={error} />;

        if (data.length === 0) return <EmptyView title={"No Data."} message={"No data to show"} titleStyle={{ color: "#aaa" }} textStyle={{ color: "#aaa" }} />

        return (
            <>
                {children}
            </>
        )
    }

    const refreshControl = <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
    return (
        <SafeAreaView style={[{flex: 1}]}>
            <ScrollView
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={refreshControl}
                style={[style]}
                contentContainerStyle={{ flexGrow: 1 }}>
                {renderScrollViewContent()}
            </ScrollView>
        </SafeAreaView>
    )
}