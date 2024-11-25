import React from 'react';
import { Text, ImageBackground, View, Pressable } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// HOOKS
import useTMDB from '../hooks/useTMDB';
// import useFavorites from '../hooks/useFavorites';

// CONFIG
import { colors, YOUTUBE_URL } from "../core/Config"

export default function SpotlightItem({ item }) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // HOOKS
    const { genresString, year, director, creators } = useTMDB(item);
    // const { favorites, isFavorite, toggleFavorite } = useFavorites();

    // ==========================================================================================
    // 2 - ACTION HANDLERS
    // ==========================================================================================
    // const isItemFavorite = useMemo(() => {
    //     return isFavorite(item);
    // }, [favorites]);

    // ON MORE INFO PRESSED
    const onPress = () => navigation.navigate('Details', { item: item });

    // ON ADD TO FAVORITE PRESSED
    // const onToggleFavorite = () => toggleFavorite(item);

    // ==========================================================================================
    // 3 - STYLES
    // ==========================================================================================
    const PADDING = 12;
    const styles = {
        container: {
            borderRadius: 10,
            marginHorizontal: PADDING,
            flexDirection: "row"
        },

        image: {
            borderRadius: 10,
            width: '100%',
            height: undefined,
            aspectRatio: 500 / 750,
            backgroundColor: colors.secondary,
        },

        metaContainer: {
            flex: 1,
            paddingRight: 8,
        },

        title: {
            fontSize: 16,
            lineHeight: 19,
            fontWeight: "600",
            color: "#fff",
        },

        subtitle: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "500",
            color: colors.text,
            marginTop: 8,
        },

        description: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "400",
            color: "#fff",
            marginVertical: 8
        },
        type: {
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "400",
            color: "gray"
        },
    };

    //==============================================================================================
    //3 -  UI ACTION HANDLERS
    //==============================================================================================
    const renderImage = () => {
        let source = { uri: item?.image ? `${item.image}` : `${YOUTUBE_URL}${item.key}/0.jpg` };
        return <ImageBackground imageStyle={[styles.image]} style={[styles.image]} source={source} />
    }

    // ==========================================================================================
    // 4 - RENDER VIEW
    // ========================================================================================== 
    return (
        <Pressable onPress={onPress} style={{ marginTop: 8 }}>
            <View style={[styles.container]}>
                <View style={{ flex: 1/2, paddingRight: 12 }}>
                    {renderImage()}
                </View>
                <View style={[styles.metaContainer]}>
                    <Text style={styles.title}>
                        {item?.title || item?.name} ({year})
                    </Text>
                    {genresString && <Text style={styles.subtitle}>{`${genresString}`}</Text>}
                    {item?.overview && <Text style={styles.description} numberOfLines={3}>{item.overview}</Text>}
                    {director && <Text style={styles.type}>Director: {director}</Text>}
                    {creators && <Text style={styles.type} numberOfLines={2}>Creators: {creators}</Text>}
                </View>
            </View>
        </Pressable>
    )
}
