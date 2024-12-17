import React, { useMemo } from 'react';
import { Text, ImageBackground, View, Image, Pressable, Alert, Linking } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { Icon } from '@rneui/themed';

// HOOKS
import useTMDB from '../hooks/useTMDB';
import { useFavoriteContext } from "../providers/FavoriteProvider";

// CONFIG
import { colors, IMAGE_URL, LARGE_IMAGE_URL, YOUTUBE_URL } from "../core/Config"

// COMPONENTS
import PersonInfoItem from './People/PersonInfoItem';
import MainItem from './Details/MainItem';

export default function DetailItem(props) {
    const { type } = props;
    if (type === "header") return <HeaderItem {...props} />
    else if (type === "main") return <MainItem {...props} />
    else if (type === "person") return <PersonInfoItem {...props} />
    else if (type === "seasons") return <SeasonsItem {...props} />
    else if (type === "credits") return <CastCrewItem {...props} />
    else if (type === "video") return <VideoItem {...props} />
    else if (type === "episode" || type === "episodes") return <EpisodeItem {...props} />
    else return null;
}

// ==========================================================================================
// HEADER ITEM
function HeaderItem({ item }) {
    // 1 - DECLARE VARIABLES
    // HOOKS
    const { backdrop_path } = useTMDB(item);
    const { favorites, isFavorite, toggleFavorite } = useFavoriteContext();

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
    const styles = {
        image: {
            width: "100%",
            height: undefined,
            aspectRatio: 500 / 281,
            backgroundColor: colors.secondary,
            justifyContent: "flex-end",
            alignItems: "flex-end",
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

        buttonText: {
            color: "white",
            textAlign: "center",
            fontWeight: "500",
            fontSize: 14,
        },

        icon: {
            marginRight: 8
        }
    };

    return (
        <ImageBackground imageStyle={styles.image} style={styles.image} source={{ uri: `${LARGE_IMAGE_URL}${backdrop_path}` || "" }} >
            <Pressable style={[styles.actionButtons, { backgroundColor: "rgb(29, 29, 29)" }]} onPress={onToggleFavorite}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center" }}>
                    <Icon size={16} name={isItemFavorite ? "heart" : "hearto"} type="antdesign" color={isItemFavorite ? "red" : "white"} style={styles.icon} />
                    <Text style={[styles.buttonText]}>
                        {"Favorites"}
                    </Text>
                </View>
            </Pressable>
        </ImageBackground>
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

    const renderImage = () => {
        let gender = item?.gender || 0;
        let source = item?.profile_path ? { uri: `${IMAGE_URL}${item?.profile_path}` } : (gender == 0) ? require("../images/cast-male-empty.png") : require("../images/cast-female-empty.png");
        return <Image imageStyle={styles.image} style={styles.image} source={source} />
    }

    let subtitle = item?.character || item?.job;
    if (item?.roles) subtitle = item?.roles[0]?.character || "";
    else if (item?.jobs) subtitle = item?.jobs[0]?.job || "";

    return (
        <View style={[styles.container]}>
            <View style={styles.image}>
                {renderImage()}
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

    const renderImage = () => {
        let source = item?.poster_path ? { uri: `${IMAGE_URL}${item?.poster_path}` } : require("../images/media-empty.png");
        return <Image imageStyle={styles.image} style={styles.image} source={source} />
    }

    let onPress = () => navigation.push('List', { title: item.name, columns: 1, type: "episodes", season_number: item?.season_number, series_id: item?.series_id });
    return (
        <Pressable onPress={onPress}>
            <View style={styles.container}>
                {renderImage()}
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
            marginBottom: PADDING,
            paddingHorizontal: 12,
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

    let url = `https://www.youtube.com/watch?v=${item.key}`;
    let onPress = async () => {
        Alert.alert(`Watch ${item.type}`, 'This video will be opened on the YouTube Website or the YouTube App if available.', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: async () => await Linking.openURL(url) },
        ]);
    }

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