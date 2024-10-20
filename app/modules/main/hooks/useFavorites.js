import { useEffect, useState } from "react";

// THIRD PARTY COMPONENTS
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useFavorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        (async () => await getFavorites())();
    }, []);

    const getFavorites = async () => {
        try {
            let favorites = await AsyncStorage.getItem('favorites')
            favorites = favorites ? JSON.parse(favorites) : []
            setFavorites(favorites);
            return favorites;
        } catch (e) {
            alert(e.message);
            throw new Error(e);
        }
    }

    const isFavorite = (item) => {
        // check if the item is in the favorites list and return a boolean
        const value = favorites.find(fav => fav.id === item.id);
        return  value ? true : false;
    };

    const toggleFavorite = (item) => {
        if (isFavorite(item)) removeFavorite(item);
        else addFavorite(item);
    }

    const addFavorite = async (item) => {
        try {
            let favorites = await AsyncStorage.getItem('favorites')
            favorites = favorites ? JSON.parse(favorites) : []
            favorites.unshift(item);
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            setFavorites(favorites);
        } catch (e) {
            alert(e.message);
            throw new Error(e);
        }
    };

    const removeFavorite = async (item) => {
        try {
            let favorites = await AsyncStorage.getItem('favorites')
            favorites = favorites ? JSON.parse(favorites) : []
            favorites = favorites.filter((fav) => fav.id !== item.id);
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            setFavorites(favorites);
        } catch (e) {
            alert(e.message);
            throw new Error(e);
        }
    }

    return {
        favorites,
        getFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite
    };
}