import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

// 3RD PARTY COMPONENTS
import { CheckBox } from "@rneui/themed";
import { TabView, SceneMap } from 'react-native-tab-view';

// CONFIG
import { colors } from '../core/Config';

export default function SortBottomView({ onDone, sortOptions, initialValue }) {
    // 1 - DECLARE VARIABLES
    // HOOKS

    // VARIABLES
    const [sortBy, setSortBy] = useState(initialValue);

    // ==========================================================================================
    // ACTION HANDLERS
    //==========================================================================================
    const onPress = () => {
        onDone(sortBy);
    }

    const OptionItem = ({item}) => {
        return (
            <Pressable onPress={() => setSortBy(item)}>
                <View style={styles.option}>
                    <Text style={styles.optionText}>
                        {item?.name}
                    </Text>
                    <CheckBox
                        center
                        onPress={() => setSortBy(item)}
                        uncheckedIcon="circle-o"
                        checkedIcon="dot-circle-o"
                        checked={sortBy?.id === item.id}
                        containerStyle={{ margin: 0, marginRight: 0, paddingHorizontal: 12, backgroundColor: "transparent" }} />
                </View>
            </Pressable>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{"Sort By"}</Text>
            </View>
            <View>
                {sortOptions.map((item, index) =>  <OptionItem item={item} key={`option_${item.id}`}/>)}
            </View>
            <Pressable onPress={onPress}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>{"Done"}</Text>
                </View>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        // backgroundColor: "white",
    },

    headerContainer: {
        paddingHorizontal: 12,
        alignItems: "center",
        borderColor: colors.secondary,
        borderBottomWidth: StyleSheet.hairlineWidth,
         height: 35,
        textAlign: "center"
    },
    headerText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff"
    },
    button: {
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: colors.secondary,
        margin: 14,
    },

    buttonText: {
        fontWeight: "500",
        fontSize: 17,
        fontFamily: 'Helvetica Neue',
        textAlign: "center",
        color: "#fff",
    },

    containerStyle: {
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },

    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 12,
        paddingVertical: 14
    },

    optionText: {
        fontSize: 16,
        lineHeight: 21,
        color: "#fff",
        fontWeight: "500"
    },
})
