import React, { } from 'react';
import { Text, ImageBackground, View, Pressable, useWindowDimensions } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS

// CONFIG
import { colors, IMAGE_URL } from "../core/Config"

export default function PeopleItem(props) {
    // 1 - DECLARE VARIABLES
    // PROPS DESTRUCTURING
    const { item, fixed } = props;

    // NAVIGATION
    const navigation = useNavigation();

    const onPress = () => navigation.navigate('Person', { item: item });

    // ==========================================================================================
    // Styles
    // ========================================================================================== 
    const BORDER_RADIUS = 6;
    const styles = {
        container: {
            borderRadius: BORDER_RADIUS,
        },
        image: {
            borderRadius: BORDER_RADIUS,
            width: '100%',
            height: undefined,
            aspectRatio: 1004 / 1447,
            backgroundColor: colors.secondary
        },
        title: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "400",
            color: "#fff",
            marginTop: 6
        },
        wrapper: {
            flex: 1 / 3,
            position: 'relative',
            width: '100%',
            paddingRight: 4,
            paddingLeft: 4,
            paddingVertical: 4
        }
    }

    const { width: windowWidth } = useWindowDimensions();
    let width = props?.grid ? "100%" : windowWidth * .25;
    let containerStyle = [styles.container, { width }];
    let style = [styles.image, { width }]
    const renderImage = () => {
        let source = { uri: item?.profile_path ? `${IMAGE_URL}${item.profile_path}` : require("../images/media-empty.png") };
        return <ImageBackground imageStyle={[styles.image, style]} style={[style]} source={source} />
    }

    // ==========================================================================================
    // 4 - RENDER VIEW
    // ========================================================================================== 
    return (
        <Pressable onPress={onPress} style={props?.grid && styles.wrapper}>
            <View style={[containerStyle, props?.grid && { width: "100%" }]}>
                {renderImage()}
                <Text style={styles.title} numberOfLines={2}>{item?.title || item?.name}</Text>
            </View>
        </Pressable>
    )
}


export function GridPeopleItem(props) {
    const styles = {
        container: {
            flex: 1 / 3,
            padding: 4
        }
    }
    return (
        <View style={styles.container}>
            <PeopleItem {...props} grid={true} />
        </View>
    )
}