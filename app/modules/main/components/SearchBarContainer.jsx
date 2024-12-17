import React, { } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

// 3RD PARTY COMPONENTS
import { Icon, SearchBar } from '@rneui/themed';
import { FilterView } from "react-native-filter-component";

// CONFIG
import { colors } from "../core/Config";

export default function SearchBarContainer({
    searchValue,
    onChangeText,
    filters,
    filter,
    onFilterSelected,
    onClose,
    placeholder = "Type Here...",
    showFilter=false,
    onSortByPress=null
}) {
    // ==========================================================================================
    // ACTION HANDLERS
    //==========================================================================================
    //  ON FILTER ITEM SELECTED
    function _onFilterItemSeleted(selected) {
        onFilterSelected(selected);
    };

    //FILTERVIEW PROPS
    const filterViewProps = {
        data: filters,
        misc: filter ? [filter] : [],
        initialIndex: 0,
        onItemPress: _onFilterItemSeleted,
        ...filterViewStyles,
    }

    return (
        <>
            <View style={{ flexDirection: "row", paddingHorizontal: 4 }}>
                <SearchBar
                    value={searchValue}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    placeholderTextColor={"#fff"}
                    inputStyle={styles.inputStyle}
                    containerStyle={{ flex: 1, backgroundColor: colors.primary, borderTopWidth: 0, borderBottomWidth: 0 }}
                    inputContainerStyle={styles.inputContainerStyle}
                    showCancel={true}
                    autoFocus={false} />
                {/* <Pressable onPress={onClose} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </Pressable> */}
            </View>
            {
                showFilter &&
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
            }
        </>
    );
}

const styles = StyleSheet.create({
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
