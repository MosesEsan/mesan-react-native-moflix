import React, { useMemo } from 'react';
import { Text, ImageBackground, View, Pressable } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { Icon } from '@rneui/themed';
import { GridItemWrapper } from "mesan-react-native-panel";
import LinearGradient from 'react-native-linear-gradient';

// HOOKS
import useTMDB from '../hooks/useTMDB';
import { useModuleContext } from '../core/Provider';

// CONFIG
import { colors, IMAGE_URL } from "../core/Config"

export default function ModuleItem(props) {
    const { type, item } = props;

    if (type === "category") return <CategoryItem {...props} />
    else if (type === "showcase") return <ShowCaseItem {...props} />
    else if (type === "media") return <MediaItem {...props} />
    else if (type === "media-medium") return <MediaItem item={item} {...props} size={'medium'} />
    else if (type === "media-large") return <MediaItem item={item} {...props} size={'large'} />
    else if (type === "media-grid") return <GridMediaItem item={item} {...props} />
    else return null;
}

// ==========================================================================================
// SHOWCASE ITEM
export function ShowCaseItem({ item }) {
    // 1 - DECLARE VARIABLES
    // NAVIGATION
    const navigation = useNavigation();

    // HOOKS
    const { poster_path, release_date, first_air_date } = useTMDB(item);
    const { favorites, isFavorite, toggleFavorite } = useModuleContext();

    let subtitle = `${release_date || first_air_date}`;
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

        showcaseImage: {
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
        }
    };

    // ==========================================================================================
    // 4 - RENDER VIEW
    // ========================================================================================== 
    return (
        <Pressable onPress={onPress}>
            <View style={[styles.container]}>
                <ImageBackground imageStyle={styles.showcaseImage} style={styles.showcaseImage} source={{ uri: `${IMAGE_URL}${poster_path}` || "" }}>
                    {/* <View style={styles.overlay} /> */}
                    <LinearGradient style={styles.overlay} colors={["rgba(0, 0, 0, 0.9)", "transparent", "rgba(0, 0, 0, 0.6)"]} />
                </ImageBackground>
                <View style={[styles.metaContainer]}>
                    <Text style={styles.title}>
                        {item?.title || item?.name}
                    </Text>
                    {subtitle && <Text style={styles.subtitle}>{`${subtitle}`}</Text>}
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

// ==========================================================================================
// MEDIA ITEM
export function MediaItem(props) {
    // 1 - DECLARE VARIABLES
    // PROPS DESTRUCTURING
    const { item, fixed } = props;
    const { poster_path } = item;

    // NAVIGATION
    const navigation = useNavigation();

    // FAVORITES CONTEXT
    // const { favorites = [], isFavorite, toggleFavorite } = useFavorites();

    // ==========================================================================================
    // 2 - ACTION HANDLERS
    // const isItemFavorite = useMemo(() => {
    //     return isFavorite(item);
    // }, [favorites]);

    // const onToggleFavorite = () => toggleFavorite(item)

    const onPress = () => navigation.navigate('Details', { item: item });

    // ==========================================================================================
    // 3 - STYLES
    const styles = {
        container: {
            borderRadius: 10,
        },
        image: {
            borderRadius: 10,
            width: '100%',
            height: undefined,
            aspectRatio: 500 / 750,
            backgroundColor: colors.secondary
        },
        title: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "400",
            color: "#fff",
            marginTop: 6
        }
    }

    let containerStyle = [styles.container]
    let style = [styles.image]
    if (fixed) {
        let width = props?.size === "medium" ? 150 : props?.size === "large" ? 200 : 105;
        style.push({ width: width, height: width * 1.5 })
        containerStyle.push({ width: width })
    }

    // ==========================================================================================
    // 4 - RENDER VIEW
    // ========================================================================================== 
    return (
        <Pressable onPress={onPress}>
            <View style={[containerStyle]}>
                <ImageBackground imageStyle={[styles.image, style]} style={[style]} source={{ uri: `${IMAGE_URL}${poster_path}` || "" }} />
                <Text style={styles.title} numberOfLines={2}>{item?.title || item?.name}</Text>
            </View>
        </Pressable>
    )
}

MediaItem.defaultProps = {
    fixed: true,
}

export function GridMediaItem(props) {
    return (
        <GridItemWrapper style={{ paddingVertical: 4, paddingRight: 4, paddingLeft: 4 }}>
            <MediaItem {...props} fixed={false} />
        </GridItemWrapper>
    )
}

// ==========================================================================================
// CATEGORY ITEM
export function CategoryItem(props) {
    const navigation = useNavigation();
    const { item } = props;

    let onPress = () => navigation.navigate('List', { category: item });

    const styles = {
        container: {
            flex: 1,
            height: 40,
            borderRadius: 50,
            backgroundColor: "rgb(29, 29, 29)",

            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",

            padding: 10,
            paddingHorizontal: 15,
        },

        title: {
            fontSize: 16,
            lineHeight: 21,
            fontWeight: "400",
            color: "#fff"
        }
    }
    return (
        <Pressable onPress={onPress}>
            <View style={[styles.container]}>
                <Text style={styles.title}>{item.name}</Text>
            </View>
        </Pressable>
    )
}

export function GridCategoryItem(props) {
    return (
        <GridItemWrapper style={{ paddingVertical: 4, paddingRight: 4, paddingLeft: 4 }}>
            <CategoryItem {...props} />
        </GridItemWrapper>
    )
}
