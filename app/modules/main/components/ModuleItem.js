import React, { } from 'react';
import { Text, ImageBackground, View, Pressable } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// COMPONENTS
import SpotlightLargeItem from './SpotlightLargeItem';
import MediaVerticalItem from './MediaVerticalItem';
import SpotlightItem from './SpotlightItem';
import ShowCaseItem from './ShowCaseItem';
import PeopleItem, { GridPeopleItem }from './People/PeopleItem';

// CONFIG
import { colors, IMAGE_URL, LARGE_IMAGE_URL } from "../core/Config"

export default function ModuleItem(props) {
    const { type, item } = props;

    item['image'] = item.poster_path ? `${IMAGE_URL}${item.poster_path}` : null;

    if (type === "category") return <CategoryItem {...props} />
    else if (type === "showcase") return <SpotlightLargeItem {...props} />
    else if (type === "showcase-new") {
        item['image'] = item.poster_path ? `${LARGE_IMAGE_URL}${item.backdrop_path}` : null;
        return <ShowCaseItem {...props} />
    } 
    else if (type === "media" || type === "media-medium" || type === "media-large") {
        item['image'] = item.poster_path ? `${IMAGE_URL}${item.poster_path}` : null;
        return <MediaVerticalItem {...props} />
    }
    else if (type === "people" || type === "person") return <PeopleItem {...props} />
    else if (type === "people-grid"  || type === "person-grid") return <GridPeopleItem {...props} />
    else if (type === "media-grid") return <GridMediaItem item={item} {...props} />
    else if (type === "category-grid") return <CategoryItem {...props} style={{ height: 55, borderRadius: 0}} />
    else if (type === "spotlight") return <SpotlightItem {...props} />
    else return null;
}


// ==========================================================================================
// MEDIA ITEM
export function MediaItem({item, fixed= true, type=null}) {
    // 1 - DECLARE VARIABLES
    let size = null;
    if (type === "media-medium" || type === "media-large"){
        size = type.split('-')[1];
    }

    // NAVIGATION
    const navigation = useNavigation();

    // ==========================================================================================
    // 2 - ACTION HANDLERS
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
        let width = size === "medium" ? 150 : size === "large" ? 200 : 105;
        style.push({ width: width, height: width * 1.5 })
        containerStyle.push({ width: width })
    }

    const renderImage = () => {
        let source = item?.poster_path ? { uri: `${IMAGE_URL}${item?.poster_path}` } : require("../images/media-empty.png");
        return <ImageBackground imageStyle={[styles.image, style]} style={[style]} source={source} />
    }

    // ==========================================================================================
    // 4 - RENDER VIEW
    // ========================================================================================== 
    return (
        <Pressable onPress={onPress}>
            <View style={[containerStyle]}>
                {renderImage()}
                <Text style={styles.title} numberOfLines={2}>{item?.title || item?.name}</Text>
            </View>
        </Pressable>
    )
}

export function GridMediaItem(props) {
    const styles = {
        container: {
            flex: 1 / 3,
            padding: 4
        }
    }
    return (
        <View style={styles.container}>
            <MediaItem {...props} fixed={false} />
        </View>
    )
}

// ==========================================================================================
// CATEGORY ITEM
export function CategoryItem(props) {
    const navigation = useNavigation();
    const { item } = props;

    let onPress = () => navigation.push('Movies', { category: item });

    const styles = {
        container: {
            flex: 1,
            height: 40,
            borderRadius: 50,
            backgroundColor: "rgb(29, 29, 29)",

            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 15
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
            <View style={[styles.container, props?.style]}>
                <Text style={styles.title}>{item.name}</Text>
            </View>
        </Pressable>
    )
}