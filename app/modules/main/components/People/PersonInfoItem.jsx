import React from 'react';
import { Text, View, Image } from 'react-native';

// CONFIG
import { colors, IMAGE_URL } from "../../core/Config"


// PERSON INFO ITEM
export default function PersonInfoItem(props) {
    const { item } = props;
    const { biography, profile_path } = item;

    const PADDING = 15
    const styles = {
        metaContainer: {
            paddingHorizontal: PADDING,
            justifyContent: "center",
            alignItems: "center",
            marginTop: PADDING,
            flexDirection: "row"
        },

        image: {
            width: '100%',
            height: undefined,
            maxHeight: 200,
            aspectRatio: 500 / 750,
            backgroundColor: colors.secondary,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            borderRadius: 8
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
        <View>

            <View style={[styles.metaContainer]}>
                <View style={{}}>
                    <Image imageStyle={styles.image} style={styles.image} source={{ uri: `${IMAGE_URL}${profile_path}` || "" }} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>
                        {item?.title || item?.name}
                    </Text>
                    <Text style={styles.subtitle} numberOfLines={2}>
                        Known for: {item?.known_for_department}
                    </Text>
                    <Text style={styles.subtitle} numberOfLines={2}>
                        Place Of Birth: {item?.place_of_birth}
                    </Text>
                    <Text style={styles.subtitle} numberOfLines={2}>
                        Birthday: {item?.birthday}
                    </Text>
                </View>
            </View>
            <View style={styles.descriptionContainer}>
                {item?.biography && <Text style={styles.description}>{biography}</Text>}
            </View>
        </View>

    )
}

