import React from "react";
import ModuleProvider from './modules/main/core/Provider';
import FavoriteProvider from './modules/main/providers/FavoriteProvider';

export default function ProviderContainer(props) {
    return (
        <ModuleProvider>
            <FavoriteProvider>
                {props.children}
            </FavoriteProvider>
        </ModuleProvider>
    );
}