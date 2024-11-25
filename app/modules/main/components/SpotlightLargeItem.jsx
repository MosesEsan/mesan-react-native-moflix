import React, { useMemo } from 'react';
import { Text, ImageBackground, View, Pressable } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { Icon } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';

// HOOKS
import useTMDB from '../hooks/useTMDB';
import useFavorites from '../hooks/useFavorites';

// CONFIG
import { colors, IMAGE_URL } from "../core/Config"

export default function SpotlightLargeItem({ item }) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // HOOKS
    const { poster_path, date, genresString} = useTMDB(item);
    const { favorites, isFavorite, toggleFavorite } = useFavorites();
    
    // ==========================================================================================
    // 2 - ACTION HANDLERS
    // ==========================================================================================
    const isItemFavorite = useMemo(() => {
        return isFavorite(item);
    }, [favorites]);

    // ON MORE INFO PRESSED
    const onPress = () => navigation.navigate('Details', { item: item });

    // ON ADD TO FAVORITE PRESSED
    const onToggleFavorite = () => toggleFavorite(item);

    // ==========================================================================================
    // 3 - STYLES
    // ==========================================================================================
    const PADDING = 12;
    const styles = {
        container: {
            borderRadius: 10,
            marginHorizontal: PADDING,
        },

       image: {
            borderRadius: 10,
            width: '100%',
            height: undefined,
            aspectRatio: 500 / 750,
            backgroundColor: colors.secondary
        },

        overlay: {
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            // backgroundColor: "rgba(0,0,0,.5)",
            borderRadius: 10,
        },

        metaContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 12,
            paddingBottom: 25,

            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
        },

        title: {
            fontSize: 29,
            lineHeight: 32,
            fontWeight: "700",
            color: "#fff",
            textAlign: "center"
        },

        subtitle: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "500",
            color: colors.text,
            marginTop: 8,
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
        let source = item?.poster_path ? { uri: `${IMAGE_URL}${poster_path}` } : require("../images/media-empty.png");
        return (
            <ImageBackground imageStyle={styles.image} style={styles.image} source={source}>
                {/* <View style={styles.overlay} /> */}
                <LinearGradient style={styles.overlay} colors={["rgba(0, 0, 0, 0.9)", "transparent", "rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.9)"]} />
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
                <View style={[styles.metaContainer]}>
                    <Text style={styles.title}>
                        {item?.title || item?.name}
                    </Text>
                    {date && <Text style={styles.subtitle}>{`${date}`}</Text>}
                    {genresString && <Text style={styles.subtitle}>{`${genresString}`}</Text>}
                    {item?.overview && <Text style={styles.description} numberOfLines={3}>{item.overview}</Text>}
                    <View style={{ flexDirection: "row", marginTop: 8 }}>
                        <Pressable style={styles.actionButtons} onPress={onPress}>
                            <Text style={[styles.buttonText]}>
                                More Info
                            </Text>
                        </Pressable>
                        <Pressable style={[styles.actionButtons, { backgroundColor: "rgb(29, 29, 29)" }]} onPress={onToggleFavorite}>
                            <Icon size={16} name={isItemFavorite ? "heart" : "hearto"} type="antdesign" color={isItemFavorite ? "red" : "white"} style={styles.icon} />
                            <Text style={[styles.buttonText]}>
                                {"Favorites"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}