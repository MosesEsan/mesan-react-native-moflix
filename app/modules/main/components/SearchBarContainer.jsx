import React, { } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

// 3RD PARTY COMPONENTS
import { SearchBar } from '@rneui/themed';

// CONFIG
import { colors } from "../core/Config";

// COMPONENTS
import FilterAndSortView from './Search/FilterAndSortView';

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
    const filterSortViewProps = { filters, filter, initialIndex: 0, onItemPress: _onFilterItemSeleted }
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
                showFilter && <FilterAndSortView {...filterSortViewProps}/>
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
