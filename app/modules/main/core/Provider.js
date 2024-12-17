import React, { useMemo, useContext, createContext, useState } from 'react';

//CREATE REDUCER

// CONTEXT ==================================
export const moduleContext = createContext();
export const useModuleContext = () => useContext(moduleContext);
const { Provider } = moduleContext;

export default function ModuleProvider(props) {
    // 1 - DECLARE VARIABLES
    // SECTIONS - IF USING A SAME PAGE FOR MULTIPLE SECTIONS - e.g. MOVIES, TV SHOWS
    const [sections, setSections] = useState([])
    const [section, setSection] = useState({})

    // ==========================================================================================
    // 2 - ACTION HANDLERS

    const value = useMemo(() => ({
        sections, setSections,
        section, setSection

    }), [section]);

    return (
        <Provider value={value}>
            {props.children}
        </Provider>
    );
}