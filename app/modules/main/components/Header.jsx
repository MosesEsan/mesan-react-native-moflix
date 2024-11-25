import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';

// NAVIGATION
import { useNavigation } from "@react-navigation/native";

// 3RD PARTY COMPONENTS
import { Icon } from '@rneui/themed';

// HOOKS
// import useFavorites from '../hooks/useFavorites';

// CONFIG
import { colors } from "../core/Config"

export default function Header({ item }) {
    // NAVIGATION HOOKS
    const navigation = useNavigation();
    // const { favorites, isFavorite, toggleFavorite } = useFavorites();

    // ==========================================================================================
    // 2 - ACTION HANDLERS
    // ==========================================================================================
    // const isItemFavorite = useMemo(() => {
    //     return isFavorite(item);
    // }, [favorites]);

    // // ON ADD TO FAVORITE PRESSED
    // const onToggleFavorite = () => toggleFavorite(item);

    // ==========================================================================================
    //  RENDER VIEW
    //==========================================================================================
    return (
        <View style={{ height: 56, position: "absolute", left: 0, right: 0, top: 0, zIndex: 10000, justifyContent: "center", alignItems: "flex-end" }}>
            <View style={{ flexDirection: "row" }}>
                {/* <Pressable onPress={onToggleFavorite} style={{}}>
                    <Icon size={16} name={isItemFavorite ? "heart" : "hearto"} type="antdesign" color={isItemFavorite ? "red" : "white"}
                        containerStyle={[{ height: 44, width: 44, justifyContent: "center", padding: 4 }]}
                        style={[{
                            flex: 1,
                            justifyContent: 'center',
                            borderRadius: "50%",
                            backgroundColor: colors.primary
                        }]} />
                </Pressable> */}
                <Pressable onPress={() => navigation.goBack()} style={{ marginLeft: 6 }}>
                    <Icon name={"close"} color={"#fff"} type={"ionicon"}
                        containerStyle={[{ height: 44, width: 44, justifyContent: "center", padding: 4 }]}
                        style={[{
                            flex: 1,
                            justifyContent: 'center',
                            borderRadius: "50%",
                            backgroundColor: colors.primary
                        }]} />
                </Pressable>
            </View>
        </View>
    )
}