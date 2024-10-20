import React from "react";
import ModuleProvider from './modules/main/core/Provider';

export default function ProviderContainer(props) {
    return (
        <ModuleProvider>
            {props.children}
        </ModuleProvider>
    );
}