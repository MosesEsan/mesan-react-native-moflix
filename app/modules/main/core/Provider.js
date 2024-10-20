import React, { useMemo, useContext, createContext, useState } from 'react';

//CREATE REDUCER
import { useCRUD } from "react-native-helper-views";
import useFavorites from '../hooks/useFavorites';

// CONTEXT ==================================
export const moduleContext = createContext();
export const useModuleContext = () => useContext(moduleContext);
const { Provider } = moduleContext;

export default function ModuleProvider(props) {
    // 1 - DECLARE VARIABLES
    // SECTIONS - IF USING A SAME PAGE FOR MULTIPLE SECTIONS - e.g. MOVIES, TV SHOWS
    const [sections, setSections] = useState([])
    const [section, setSection] = useState({})

    // CRUD HOOK
    const dataProvider = useCRUD([])

    // FAVORITES HOOK
    const {         
        favorites,
        getFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite
     } = useFavorites();

    // ==========================================================================================
    // 2 - ACTION HANDLERS
    const setData = (data) => {
        dataProvider.setData(data)
        dataProvider.setError(null)
        reset();
    };

    const setError = (error) => {
        dataProvider.setError(error)
        reset();
    };

    const reset = () => {   
        dataProvider.setIsFetching(false)
        dataProvider.setIsRefreshing(false)
    }

    const clearData = () => {
        dataProvider.setData([])
    };

    const memoizedValues = { data, error, isFetching, isRefreshing, setLoading} = dataProvider;
    const value = useMemo(() => ({
        ...memoizedValues,
        dataProvider,
        setData, clearData, setError,

        sections, setSections,
        section, setSection,

        // FAVORITES
        favorites,
        getFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite

    }), [data, error, isFetching, isRefreshing, section, favorites]);

    return (
        <Provider value={value}>
            {props.children}
        </Provider>
    );
}