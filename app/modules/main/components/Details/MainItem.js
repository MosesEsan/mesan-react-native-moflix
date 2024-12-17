import React from 'react';
import { Text, View, Pressable, Alert, Linking } from 'react-native';

// HOOKS
import useTMDB from '../../hooks/useTMDB';

// CONFIG
import { colors, YOUTUBE_URL } from "../../core/Config"

// ==========================================================================================
// MAIN ITEM
export default function MainItem(props) {
    const { item } = props;
    const { overview } = item;
    const { vote_average, languages, genres, runtime, number_of_seasons, date, year, videos } = useTMDB(item);

    const trailers = videos.filter(item => item.type === 'Trailer');
    let url = trailers.length> 0 ? `https://www.youtube.com/watch?v=${trailers[0].key}` : null;
    let onPress = async () => {
        Alert.alert(`Watch Trailer`, 'This video will be opened on the YouTube Website or the YouTube App if available.', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: async () => await Linking.openURL(url) },
        ]);
    }

    const PADDING = 14
    const styles = {
        metaContainer: {
            padding: PADDING
        },

        title: {
            fontSize: 23,
            lineHeight: 29,
            fontWeight: "700",
            color: "white"
        },

        subtitle: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "500",
            color: "white",
            marginTop: 8,
        },

        genresContainer: {
            flexDirection: "row",
            paddingHorizontal: PADDING,
        },

        genreContainer: {
            height: 24,
            borderRadius: 50,
            backgroundColor: colors.secondary,

            flexDirection: "row",
            alignItems: "center",

            paddingHorizontal: 8,
            marginRight: 8
        },

        genreTitle: {
            fontSize: 13,
            lineHeight: 16,
            fontWeight: "400",
            color: "#fff"
        },

        descriptionContainer: {
            flex: 1,
            paddingHorizontal: PADDING,
            marginVertical: PADDING,
        },

        description: {
            fontSize: 16,
            lineHeight: 21,
            fontWeight: "400",
            color: "#fff",
        },

        actionButtons: {
            flex: 1,
            padding: 6,
            backgroundColor: "#ffffff",
            borderRadius: 8,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 25,
            flexDirection: "row",
            marginHorizontal: PADDING,
            marginTop: PADDING
        },
        buttonText: {
            textAlign: "center",
            fontWeight: "600",
            fontSize: 18,
        },
    };

    return (
        <View style={{  }}>
            <View style={[styles.metaContainer]}>
                <Text style={styles.title}>
                    {item?.title || item?.name}
                </Text>
                <Text style={styles.subtitle} numberOfLines={2}>
                    {`${year}`} · {`${runtime || number_of_seasons}`} · {`${vote_average}`}
                </Text>
                <Text style={styles.subtitle} numberOfLines={2}>
                    {`${languages}`}
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
            {
                trailers.length > 0 &&
                <Pressable style={styles.actionButtons} onPress={onPress}>
                    <Text style={[styles.buttonText]}>
                        Watch Trailer
                    </Text>
                </Pressable>
            }
            <View style={styles.descriptionContainer}>
                {item?.overview && <Text style={styles.description}>{overview}</Text>}
            </View>
        </View>

    )
}