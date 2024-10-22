import React, { useMemo } from 'react';
import { Text, ImageBackground, View, Image, Pressable } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { Icon } from '@rneui/themed';

// HOOKS
import useTMDB from '../hooks/useTMDB';
import { useModuleContext } from '../core/Provider';

// CONFIG
import { colors, IMAGE_URL, LARGE_IMAGE_URL, YOUTUBE_URL } from "../core/Config"

export default function DetailItem(props) {
    const { type } = props;
    if (type === "header") return <HeaderItem {...props} />
    else if (type === "main") return <MainItem {...props} />
    else if (type === "seasons") return <SeasonsItem {...props} />
    else if (type === "cast-crew") return <CastCrewItem {...props} />
    else if (type === "video") return <VideoItem {...props} />
    else if (type === "episode" || type === "episodes") return <EpisodeItem {...props} />
    else return null;
}

// ==========================================================================================
// HEADER ITEM
function HeaderItem({ item }) {
    // 1 - DECLARE VARIABLES
    // HOOKS
    const { backdrop_path, languages, genres, runtime, number_of_seasons } = useTMDB(item);
    const { favorites, isFavorite, toggleFavorite } = useModuleContext();

    // ==========================================================================================
    // 2 - ACTION HANDLERS
    // ==========================================================================================
    const isItemFavorite = useMemo(() => {
        return isFavorite(item);
    }, [favorites]);


    // ON ADD TO FAVORITE PRESSED
    const onToggleFavorite = () => toggleFavorite(item);

    // ==========================================================================================
    // 3 - STYLES
    // ==========================================================================================
    const PADDING = 15
    const styles = {
        image: {
            width: "100%",
            height: undefined,
            aspectRatio: 500 / 281,
            backgroundColor: colors.secondary,
            justifyContent: "flex-end",
            alignItems: "flex-end",
        },

        metaContainer: {
            paddingHorizontal: PADDING,
            justifyContent: "center",
            alignItems: "center",
            marginTop: PADDING,
        },

        title: {
            fontSize: 23,
            lineHeight: 29,
            fontWeight: "700",
            color: "white",
            textAlign: "center",
        },

        subtitle: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "500",
            color: "white",
            marginTop: 8,
            textAlign: "center"
        },

        genresContainer: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: PADDING,
        },

        genreContainer: {
            height: 34,
            borderRadius: 50,
            backgroundColor: colors.secondary,

            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",

            paddingHorizontal: 15,
            marginHorizontal: 8
        },

        genreTitle: {
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "400",
            color: "#fff"
        },

        actionButtons: {
            margin: 6,
            padding: 6,
            backgroundColor: "#eb4325",
            borderRadius: 50,
            maxWidth: 120,
            height: 40,
            paddingHorizontal: 25,
            justifyContent: "center",
            alignItems: "center",
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

    return (
        <View style={[]}>
            <ImageBackground imageStyle={styles.image} style={styles.image} source={{ uri: `${LARGE_IMAGE_URL}${backdrop_path}` || "" }} >
                <Pressable style={[styles.actionButtons, { backgroundColor: "rgb(29, 29, 29)" }]} onPress={onToggleFavorite}>
                    <View style={{ flexDirection: "row", justifyContent:"center", alignContent:"center" }}>
                        <Icon size={16} name={isItemFavorite ? "heart" : "hearto"} type="antdesign" color={isItemFavorite ? "red" : "white"} style={styles.icon} />
                        <Text style={[styles.buttonText]}>
                            {"Favorites"}
                        </Text>
                    </View>
                </Pressable>
            </ImageBackground>
            <View style={[styles.metaContainer]}>
                <Text style={styles.title}>
                    {item?.title || item?.name}
                </Text>
                <Text style={styles.subtitle} numberOfLines={2}>
                    {`${languages} |`} {`${item?.release_date || item?.first_air_date}`} | {`${runtime || number_of_seasons}`}
                </Text>
            </View>

            <View style={styles.genresContainer}>
                {
                    genres.map((genre, index) => {
                        return (
                            <View style={[styles.genreContainer]} key={index}>
                                <Text style={styles.genreTitle}>{genre.name}</Text>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}

// ==========================================================================================
// MAIN ITEM
function MainItem(props) {
    const { item } = props;
    const { overview } = item;

    const PADDING = 15
    const styles = {
        descriptionContainer: {
            flex: 1,
            paddingHorizontal: PADDING,
            marginVertical: PADDING * 1.5,
        },

        description: {
            fontSize: 16,
            lineHeight: 21,
            fontWeight: "400",
            color: "#fff",
        }
    };

    return (
        <View style={styles.descriptionContainer}>
            {item?.overview && <Text style={styles.description}>{overview}</Text>}
        </View>
    )
}

// ==========================================================================================
// CAST CREW ITEM
function CastCrewItem(props) {
    const { item } = props;
    const styles = {
        container: {
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 8,
            flexDirection: "row",
            flex: 1,
            marginHorizontal: 12,
            marginVertical: 8
        },
        role: {
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "400",
            color: "grey",
            marginBottom: 4
        },
        name: {
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "500",
            color: "#fff"
        },
        image: {
            height: 55,
            width: 55, 
            borderRadius: 55 / 2,
            backgroundColor: colors.secondary,
            marginRight: 15,
        }
    }


    let subtitle = item?.character || item?.job || ""
    return (
        <View style={[styles.container]}>
            <View style={styles.image}>
                <Image source={{ uri: `${IMAGE_URL}${item?.profile_path}` || "" }} style={styles.image} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.role}>{subtitle}</Text>
                <Text style={styles.name}>{item.name}</Text>
            </View>
        </View>
    )
}

// ==========================================================================================
// SEASON ITEM
function SeasonsItem(props) {
    const navigation = useNavigation();
    const { item } = props;

    const styles = {
        container: {
            flex: 1
        },
        image: {
            borderRadius: 10,
            overflow: "hidden",
            width: 100,
            height: 100 * 1.5,
            backgroundColor: colors.secondary
        },
        type: {
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "400",
            color: "gray"
        },
        title: {
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "500",
            color: colors.text
        },
    }

    let onPress = () => navigation.push('List', { title: item.name, columns: 1, type: "episodes", season_number: item?.season_number, series_id: item?.series_id });
    return (
        <Pressable onPress={onPress}>
            <View style={styles.container}>
                <Image imageStyle={styles.image} style={styles.image} source={{ uri: `${IMAGE_URL}${item?.poster_path}` || "" }} />
                <View>
                    <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.type}>{`${item.episode_count} Episodes`}</Text>
                </View>
            </View>
        </Pressable>
    )
}

// ==========================================================================================
// EPISODE ITEM
function EpisodeItem(props) {
    const { item } = props;

    const PADDING = 15
    const styles = {
        container: {
            flex: 1,
            marginBottom: PADDING
        },
        topContainer: {
            flex: 1,
            flexDirection: "row",
        },
        image: {
            width: 80 * 1.5,
            height: 80,
            marginRight: PADDING / 2,
            borderRadius: 10,
            backgroundColor: colors.secondary,
        },
        textContainer: {
            flex: 1
        },
        type: {
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "400",
            color: "gray"
        },
        title: {
            fontSize: 14,
            lineHeight: 19,
            color: "#fff"
        },
        description: {
            fontSize: 14,
            lineHeight: 19,
            color: "gray",
            marginTop: 8
        },
    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Image source={{ uri: `${IMAGE_URL}${item?.still_path}` || "" }} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={2}>
                        {`${item.episode_number}. ${item.name}`}
                    </Text>
                    <Text style={styles.type}>{`${item.runtime} mins`}</Text>
                </View>
            </View>

            <Text style={styles.description}>
                {`${item.overview}`}
            </Text>
        </View>
    )
}

// ==========================================================================================
// VIDEO ITEM
function VideoItem(props) {
    const navigation = useNavigation();

    const { item } = props;
    const styles = {
        container: {
            width: 200,
        },
        image: {
            height: 100,
            width: 200,
            backgroundColor: colors.secondary,
            justifyContent: "center",
            alignItems: "center",
        },
        overlay: {
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,.2)",
            borderRadius: 10,
        },
        textContainer: {
        },
        type: {
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "400",
            color: "gray"
        },
        title: {
            fontSize: 14,
            lineHeight: 19,
            fontWeight: "500",
            color: colors.text
        },
    }

    let onPress = () => navigation.navigate('MediaPlayer', { video: item });
    return (
        <Pressable onPress={onPress}>
            <View style={styles.container}>
                <ImageBackground imageStyle={styles.showcaseImage} style={styles.image} source={{ uri: `${YOUTUBE_URL}${item.key}/0.jpg` }}>
                    <View style={styles.overlay} />
                    <Icon size={32} name="play" type="antdesign" color="#fff" />
                </ImageBackground>
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.type}>{item.type || item.episode_count}</Text>
                </View>
            </View>
        </Pressable>
    )
}