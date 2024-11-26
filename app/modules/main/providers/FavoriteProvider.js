import React, { useMemo, useContext, createContext, useState, useEffect } from 'react';


// THIRD PARTY COMPONENTS
import AsyncStorage from '@react-native-async-storage/async-storage';

// CONTEXT ==================================
export const favoriteContext = createContext();
export const useFavoriteContext = () => useContext(favoriteContext);
const { Provider } = favoriteContext;

export default function FavoriteProvider(props) {
    // 1 - DECLARE VARIABLES
    // FAVORITES
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        (async () => await getFavorites())();
    }, []);

    useEffect(() => {
        // Update the favorites list in AsyncStorage
        (async () => await AsyncStorage.setItem('favorites', JSON.stringify(favorites)))();
    }, [favorites]);

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

    const addFavorite = async (item) => {
        try {
            // clone the favorites array
            let clone = [...favorites];
            clone.unshift(item);
            setFavorites(clone);
        } catch (e) {
            alert(e.message);
            throw new Error(e);
        }
    };

    const removeFavorite = async (item) => {
        try {
            const filtered = favorites.filter((fav) => fav.id !== item.id);
            setFavorites(filtered);
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

    const value = useMemo(() => ({
        favorites, setFavorites, addFavorite, removeFavorite, toggleFavorite, isFavorite
    }), [ favorites ]);

    return (
        <Provider value={value}>
            {props.children}
        </Provider>
    );
}