import React, {} from 'react';
import { Text, ImageBackground, View, Pressable, useWindowDimensions } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import LinearGradient from 'react-native-linear-gradient';

// HOOKS
import useTMDB from '../hooks/useTMDB';

// CONFIG
import { colors, YOUTUBE_URL } from "../core/Config"

export default function ShowCaseItem(props) {
    // 1 - DECLARE VARIABLES
    const { item } = props;
    
    // NAVIGATION
    const navigation = useNavigation();

    // HOOKS
    const { genresString } = useTMDB(item);
    const {width} = useWindowDimensions();

    // ==========================================================================================
    // 2 - ACTION HANDLERS
    // ==========================================================================================
    // ON MORE INFO PRESSED
    const onPress = () => navigation.navigate('Details', { item: item });

    // ==========================================================================================
    // 3 - STYLES
    // ==========================================================================================
    const styles = {
        image: {
            width: '100%',
            height: undefined,
            aspectRatio: width / 330, 
            backgroundColor: colors.secondary,
            resizeMode : "cover"
        },
        overlay: {
            position: "absolute",
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
        },
        metaContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 12,

            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
        },
        title: {
            fontSize: 25,
            lineHeight: 29,
            fontWeight: "700",
            color: "#fff",
            textAlign: "center"
        },
        subtitle: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "500",
            color: colors.text,
            marginTop: 4,
            textAlign: "center"
        },
        actionButtonsContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8
        },
        actionButtons: {
            flex: 1,
            margin: 6,
            padding: 6,
            backgroundColor: "#eb4325",
            borderRadius: 50,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 25,
            flexDirection: "row"
        },
        icon: {
            marginRight: 8
        },
        buttonText: {
            color: "white",
            textAlign: "center",
            fontWeight: "500",
            fontSize: 14,
        },
        description: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "400",
            color: "#fff",
            marginTop: 6,
            textAlign: "center",
            marginHorizontal: 12
        },
    };

    const renderImage = () => {
        let source = { uri: item?.image ? `${item.image}` : `${YOUTUBE_URL}${item.key}/0.jpg` };
        return (
            <ImageBackground imageStyle={[styles.image]} style={styles.image} source={source}>
                <LinearGradient style={styles.overlay} colors={["rgba(0, 0, 0, 0.7)", "transparent", "rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.9)"]} />
            </ImageBackground>
        )
    }

    // ==========================================================================================
    // 4 - RENDER VIEW
    // ========================================================================================== 
    return (
        <Pressable onPress={onPress}>
            <View style={[styles.container]}>
                {renderImage()}
                <View style={[styles.metaContainer, { paddingBottom: 30 }]}>
                    <Text style={styles.title}>{item?.title || item?.name}</Text>
                    {genresString && <Text style={styles.subtitle}>{`${genresString}`}</Text>}
                    {item?.overview && <Text style={styles.description} numberOfLines={3}>{item.overview}</Text>}
                </View>
            </View>
        </Pressable>
    )
}