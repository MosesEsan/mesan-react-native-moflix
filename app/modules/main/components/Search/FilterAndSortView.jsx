import React, { } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

// 3RD PARTY COMPONENTS
import { Icon } from '@rneui/themed';
import { FilterView } from "react-native-filter-component";

export default function FilterAndSortView({filters, filter, initialIndex, onItemPress, onSortByPress}) {
    //FILTERVIEW PROPS
    const filterViewProps = {
        data: filters,
        misc: filter ? [filter] : [],
        initialIndex,
        onItemPress,
        ...filterViewStyles,
    }
    return(
        <View style={{ flexDirection: "row", alignItems:"center", paddingBottom: 6}}>
        <FilterView {...filterViewProps} />
        {
            onSortByPress &&
            <Pressable onPress={onSortByPress}>
                <View style={{ width: 50, height: 40, justifyContent:"center" }}>
                    <Icon size={16} name={"sort"} type="font-awesome" color={"white"} />
                </View>
            </Pressable>
        }
    </View>
    )
}

const filterViewStyles = StyleSheet.create({
    headerStyle: { color: "white" },
    containerStyle: {
        backgroundColor: "transparent",
        flex:1
    },
    itemContainerStyle: {
        backgroundColor: "transparent",
        borderWidth: 0,
        height: 30,
        marginVertical: 0,
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
